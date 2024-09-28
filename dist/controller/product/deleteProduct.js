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
exports.deleteProduct = void 0;
const Product_1 = require("../../models/Product");
// Delete Product Controller
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Find product by ID and delete
        const product = yield Product_1.Product.findByIdAndDelete(id);
        // Check if the user role_type and isApproved (if MERCHANT)
        const user = req.user; // Assuming the `user` is attached to the request after JWT authentication
        // Check if the user is an admin
        if (user.role_type !== "ADMIN") {
            // If the user is not an admin, check if they are a merchant and approved
            if (user.role_type !== "MERCHANT" || !user.isApproved) {
                return res.status(403).json({
                    responseCode: 403,
                    responseMessage: "Only approved merchants or admin users can delete products.",
                    data: null,
                });
            }
        }
        if (!product) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "Product not found",
                data: null,
            });
        }
        return res.status(200).json({
            responseCode: 200,
            responseMessage: "Product deleted successfully",
            data: null,
        });
    }
    catch (err) {
        console.error("Error deleting product:", err);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal Server Error",
            data: null,
        });
    }
});
exports.deleteProduct = deleteProduct;
