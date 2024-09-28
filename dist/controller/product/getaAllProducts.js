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
exports.getAllProducts = void 0;
const Product_1 = require("../../models/Product");
// Get All Products with Pagination Controller
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page = 1, size = 10 } = req.query;
        // Convert query params to numbers and enforce limit
        page = parseInt(page, 10);
        size = Math.min(parseInt(size, 10), 100); // Maximum size is 100
        const skip = (page - 1) * size;
        // Fetch products with pagination
        const products = yield Product_1.Product.find()
            .skip(skip)
            .limit(size).select("-__v");
        // Get total product count for pagination info
        const totalProducts = yield Product_1.Product.countDocuments();
        return res.status(200).json({
            responseCode: 200,
            responseMessage: "Products retrieved successfully",
            data: {
                products,
                pagination: {
                    totalProducts,
                    currentPage: page,
                    pageSize: size,
                    totalPages: Math.ceil(totalProducts / size),
                },
            },
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
exports.getAllProducts = getAllProducts;
