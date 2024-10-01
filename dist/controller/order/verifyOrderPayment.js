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
exports.verifyPayment = void 0;
const axios_1 = __importDefault(require("axios"));
const Order_1 = require("../../models/Order");
const envConfig_1 = require("../../utils/envConfig");
// Verify Payment Controller
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reference, paymentMethod } = req.query;
        if (!reference || typeof reference !== 'string') {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: "Reference is required and must be a string.",
                data: null,
            });
        }
        if (!paymentMethod || typeof paymentMethod !== 'string') {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: "Payment method is required and must be a string.",
                data: null,
            });
        }
        let paymentData;
        if (paymentMethod === 'PAYSTACK') {
            // Make a request to Paystack to verify the payment
            const config = {
                headers: {
                    Authorization: `Bearer ${envConfig_1.paystackSecretKey}`,
                },
            };
            const paystackResponse = yield axios_1.default.get(`${envConfig_1.paystackApiUrl}verify/${reference}`, config);
            paymentData = paystackResponse.data.data;
            // Check if the payment was successful
            if (paymentData.status !== "success") {
                return res.status(400).json({
                    responseCode: 400,
                    responseMessage: "Payment verification failed.",
                    data: null,
                });
            }
        }
        else if (paymentMethod === 'FLUTTER_WAVE') {
            // Make a direct GET request to Flutterwave to verify the payment using tx_ref
            const flutterwaveUrl = `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${reference}`;
            const flutterwaveResponse = yield axios_1.default.get(flutterwaveUrl, {
                headers: {
                    Authorization: `Bearer ${envConfig_1.flutterWaveSecretKey}`,
                },
            });
            paymentData = flutterwaveResponse.data;
            // Check if the payment was successful
            if (paymentData.status !== "success") {
                return res.status(400).json({
                    responseCode: 400,
                    responseMessage: "Payment verification failed.",
                    data: null,
                });
            }
        }
        else {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: "Invalid payment method.",
                data: null,
            });
        }
        // Check if the payment was successful
        if (paymentData.status === "success") {
            // Find the order using the reference (order ID)
            const order = yield Order_1.Order.findById(reference);
            if (!order) {
                return res.status(404).json({
                    responseCode: 404,
                    responseMessage: "Order not found.",
                    data: null,
                });
            }
            // Update order status to paid
            order.status = "paid";
            yield order.save();
            return res.status(200).json({
                responseCode: 200,
                responseMessage: "Payment verified successfully.",
                data: paymentData,
            });
        }
        else {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: "Payment verification failed.",
                data: null,
            });
        }
    }
    catch (err) {
        console.error("Error verifying payment:", err);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal Server Error",
            data: null,
        });
    }
});
exports.verifyPayment = verifyPayment;
