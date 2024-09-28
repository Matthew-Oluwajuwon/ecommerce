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
exports.removeFromCart = void 0;
const Cart_1 = require("../../models/Cart");
// Remove item from cart
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id; // Assuming user is authenticated
    const { productId } = req.body;
    try {
        // Find the user's cart
        const cart = yield Cart_1.Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        // Remove the product from the cart using Mongoose's `pull` method
        cart.items.pull({ product: productId });
        // Save the updated cart
        yield cart.save();
        return res.status(200).json({ message: "Product removed from cart successfully", data: cart });
    }
    catch (error) {
        return res.status(500).json({ message: "Error removing product from cart", error });
    }
});
exports.removeFromCart = removeFromCart;
