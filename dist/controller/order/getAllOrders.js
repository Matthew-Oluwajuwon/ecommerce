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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = void 0;
const Order_1 = require("../../models/Order");
// Get All Orders Controller
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user role_type and isApproved (if MERCHANT)
    const user = req.user; // Assuming the `user` is attached to the request after JWT authentication
    // Check if the user is an admin
    if (user.role_type !== "ADMIN") {
        // If the user is not an admin, check if they are a merchant and approved
        return res.status(403).json({
            responseCode: 403,
            responseMessage: "Only approved admin users can view all orders.",
            data: null,
        });
    }
    try {
        const orders = yield Order_1.Order.find().populate('userId'); // Populate userId for user details
        return res.status(200).json({
            responseCode: 200,
            responseMessage: "Orders retrieved successfully.",
            data: orders,
        });
    }
    catch (err) {
        console.error("Error fetching all orders:", err);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal Server Error",
            data: null,
        });
    }
});
exports.getAllOrders = getAllOrders;
