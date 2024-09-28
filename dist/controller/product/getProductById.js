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
exports.getProductById = void 0;
const Product_1 = require("../../models/Product");
// Get Single Product Controller
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Find product by ID
        const product = yield Product_1.Product.findById(id).select("-__v");
        ;
        if (!product) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "Product not found",
                data: null,
            });
        }
        return res.status(200).json({
            responseCode: 200,
            responseMessage: "Product retrieved successfully",
            data: product,
        });
    }
    catch (err) {
        console.error("Error fetching product:", err);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal Server Error",
            data: null,
        });
    }
});
exports.getProductById = getProductById;
