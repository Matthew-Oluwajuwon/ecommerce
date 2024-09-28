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
exports.getProductsByUserId = void 0;
const Product_1 = require("../../models/Product");
const User_1 = require("../../models/User"); // Assuming you have a User model
// Get Products by User ID Controller (Merchant Access Only)
const getProductsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId; // Get userId from query params
    try {
        // Fetch user details based on userId
        const user = yield User_1.User.findById(userId);
        // Check if the user exists
        if (!user) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "User not found.",
                data: null,
            });
        }
        // Check if the user is a merchant
        if (user.role_type !== "MERCHANT") {
            return res.status(403).json({
                responseCode: 403,
                responseMessage: "Only merchants are allowed to view products.",
                data: null,
            });
        }
        // Fetch products created by the merchant (user)
        const products = yield Product_1.Product.find({ user: user._id });
        // If no products are found for this merchant
        if (products.length === 0) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "No products found for this merchant.",
                data: null,
            });
        }
        // Return the found products
        return res.status(200).json({
            responseCode: 200,
            responseMessage: "Products fetched successfully.",
            data: products,
        });
    }
    catch (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal Server Error",
            data: null,
        });
    }
});
exports.getProductsByUserId = getProductsByUserId;
