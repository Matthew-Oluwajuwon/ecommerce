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
exports.getAllOrdersByUserId = void 0;
const Order_1 = require("../../models/Order");
// Get All Orders by User ID Controller
const getAllOrdersByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const orders = yield Order_1.Order.find({ userId: user.id }).populate('userId');
        return res.status(200).json({
            responseCode: 200,
            responseMessage: "Orders retrieved successfully.",
            data: orders,
        });
    }
    catch (err) {
        console.error("Error fetching orders by user ID:", err);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal Server Error",
            data: null,
        });
    }
});
exports.getAllOrdersByUserId = getAllOrdersByUserId;
