"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = void 0;
const Cart_1 = require("../../models/Cart");
const Order_1 = require("../../models/Order");
const axios_1 = __importDefault(require("axios"));
const envConfig_1 = require("../../utils/envConfig");
// Create Order Controller
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const origin = req.headers.origin;
    try {
        const { userId, shippingAddress } = req.body;
        // Fetch the cart details
        const cart = yield Cart_1.Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: "Your cart is empty.",
                data: null,
            });
        }
        // Calculate total amount
        const totalAmount = cart.items.reduce((total, item) => total + item.product.productPrice * item.quantity, 0);
        // Create the order
        const order = new Order_1.Order({
            userId, // Updated to userId
            items: cart.items.map((item) => ({
                productId: item.product._id,
                quantity: item.quantity,
                price: item.product.productPrice,
            })),
            totalAmount,
            shippingAddress,
            status: 'pending', // Order status starts as pending
        });
        // Save order to database
        yield order.save();
        // Initiate payment using Paystack
        const paystackData = {
            email: req.user.email_address, // Assuming email is attached to req.user
            amount: totalAmount * 100, // Paystack uses the lowest currency unit (kobo for NGN)
            reference: order._id.toString(), // Use the order ID as the payment reference
            callback_url: origin
        };
        const config = {
            headers: {
                Authorization: `Bearer ${envConfig_1.paystackSecretKey}`,
            },
        };
        const paystackResponse = yield axios_1.default.post(envConfig_1.paystackApiUrl + 'initialize', paystackData, config);
        const paymentUrl = paystackResponse.data.data.authorization_url;
        // Return the payment link to the client
        return res.status(201).json({
            responseCode: 201,
            responseMessage: "Order created successfully. Proceed to payment.",
            data: {
                order,
                paymentUrl,
            },
        });
    }
    catch (err) {
        console.error("Error creating order:", err);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal Server Error",
            data: null,
        });
    }
});
exports.createOrder = createOrder;
