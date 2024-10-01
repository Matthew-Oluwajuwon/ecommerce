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
const User_1 = require("../../models/User"); // Assuming User model is available
const axios_1 = __importDefault(require("axios"));
const envConfig_1 = require("../../utils/envConfig");
const joi_1 = __importDefault(require("joi"));
// Create Order Controller
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const origin = req.headers.origin;
    const { id: userId } = req.user;
    // Define the shippingAddress schema
    const shippingAddressSchema = joi_1.default.object({
        street: joi_1.default.string().min(3).required(), // Require a minimum length for street
        city: joi_1.default.string().min(3).required(), // Require a minimum length for city
        postalCode: joi_1.default.string().min(3).required(), // Require a minimum length for postalCode
        country: joi_1.default.string().min(2).required(), // Require a minimum length for country
    });
    // Define the main schema
    const orderSchema = joi_1.default.object({
        isHomeAddress: joi_1.default.boolean().required(), // isHomeAddress must be a boolean
        paymentMethod: joi_1.default.string().valid('PAYSTACK', 'FLUTTER_WAVE').required(), // Payment method must be "PAYSTACK"
        callback_url: joi_1.default.string().uri().required(), // Ensure callback_url is a valid URI
        shippingAddress: shippingAddressSchema.optional(), // shippingAddress is optional
    });
    const { error } = orderSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            responseCode: 400,
            responseMessage: (_a = error.details[0].message) === null || _a === void 0 ? void 0 : _a.replace(/\"/g, ""),
            data: null,
        });
    }
    try {
        const { shippingAddress, isHomeAddress, callback_url, paymentMethod } = req.body;
        // Verify if the user exists
        const user = yield User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "User not found.",
                data: null,
            });
        }
        // Fetch the cart details
        const cart = yield Cart_1.Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: "Your cart is empty.",
                data: null,
            });
        }
        if (!isHomeAddress && !shippingAddress) {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: "You need to pass shipping address or select if you want to use your home address",
                data: null,
            });
        }
        // Determine the shipping address based on isHomeAddress flag
        const finalShippingAddress = isHomeAddress ? user.home_address : shippingAddress;
        // Calculate total amount
        const totalAmount = cart.items.reduce((total, item) => total + item.product.productPrice * item.quantity, 0);
        // Create the order
        const order = new Order_1.Order({
            userId,
            items: cart.items.map((item) => ({
                productId: item.product._id,
                quantity: item.quantity,
                price: item.product.productPrice,
            })),
            totalAmount,
            shippingAddress: finalShippingAddress,
            status: 'pending', // Order status starts as pending
        });
        // Save order to database
        yield order.save();
        // Initiate payment using Paystack
        const paystackData = {
            email: user.email_address, // Assuming email is in the User model
            amount: totalAmount * 100, // Paystack uses the lowest currency unit (kobo for NGN)
            reference: order._id.toString(), // Use the order ID as the payment reference
            callback_url: callback_url || origin
        };
        // Initiate payment using Flutterwave
        const flutterwaveData = {
            tx_ref: order._id.toString(),
            amount: totalAmount * 100,
            currency: "NGN",
            redirect_url: callback_url || origin,
            customer: {
                email: user.email_address,
                phone_number: user.phone_number || "",
                name: user.first_name + " " + user.last_name || ""
            }
        };
        const config = {
            headers: {
                Authorization: `Bearer ${paymentMethod === "FLUTTER_WAVE" ? envConfig_1.flutterWaveSecretKey : envConfig_1.paystackSecretKey}`,
            },
        };
        // Paystack payment response
        const paymentResponse = yield axios_1.default.post(paymentMethod === "FLUTTER_WAVE" ? (envConfig_1.flutterWaveApiBaseUrl + "payments") : (envConfig_1.paystackApiUrl + 'initialize'), paymentMethod === "FLUTTER_WAVE" ? flutterwaveData : paystackData, config);
        const paymentUrl = paymentResponse.data.data.authorization_url || paymentResponse.data.data.link;
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
