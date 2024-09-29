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
exports.getSingleOrderByUserIdAndOrderId = void 0;
const Order_1 = require("../../models/Order");
// Get Single Order by User ID and Order ID Controller
const getSingleOrderByUserIdAndOrderId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const { orderId } = req.params;
        const order = yield Order_1.Order.findOne({ userId: user.id, _id: orderId }).populate('userId');
        if (!order) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "Order not found.",
                data: null,
            });
        }
        return res.status(200).json({
            responseCode: 200,
            responseMessage: "Order retrieved successfully.",
            data: order,
        });
    }
    catch (err) {
        console.error("Error fetching order by user ID and order ID:", err);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal Server Error",
            data: null,
        });
    }
});
exports.getSingleOrderByUserIdAndOrderId = getSingleOrderByUserIdAndOrderId;
