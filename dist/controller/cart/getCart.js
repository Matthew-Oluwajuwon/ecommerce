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
exports.getCart = void 0;
const Cart_1 = require("../../models/Cart");
// Get user's cart
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id; // Assuming user is authenticated and userId is in the token
    try {
        const cart = yield Cart_1.Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "Cart not found",
                data: null,
            });
        }
        return res.status(200).json({
            responseCode: 200,
            responseMessage: "Cart retrieved successfully",
            data: cart,
        });
    }
    catch (error) {
        console.error("Error retrieving cart:", error);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal Server Error",
            data: null,
        });
    }
});
exports.getCart = getCart;
