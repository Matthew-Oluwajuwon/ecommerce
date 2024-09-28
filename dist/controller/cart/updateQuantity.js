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
exports.updateCartItemQuantity = void 0;
const Cart_1 = require("../../models/Cart");
// Update quantity of a product in the cart
const updateCartItemQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id; // Assuming user is authenticated
    const { productId, quantity } = req.body;
    try {
        const cart = yield Cart_1.Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "Cart not found",
                data: null,
            });
        }
        // Check if the product exists in the cart
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "Product not found in cart",
                data: null,
            });
        }
        // Update the quantity
        cart.items[itemIndex].quantity = quantity;
        yield cart.save();
        return res.status(200).json({
            responseCode: 200,
            responseMessage: "Cart updated successfully",
            data: cart,
        });
    }
    catch (error) {
        console.error("Error updating cart:", error);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal Server Error",
            data: null,
        });
    }
});
exports.updateCartItemQuantity = updateCartItemQuantity;
