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
exports.getAllCategories = void 0;
const Category_1 = require("../../models/Category");
// Get All Categories with Pagination Controller
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page = 1, size = 100 } = req.query;
        // Convert query params to numbers and enforce limit
        page = parseInt(page, 10);
        size = Math.min(parseInt(size, 10), 10); // Maximum size is 100
        const skip = (page - 1) * size;
        // Fetch categories with pagination
        const categories = yield Category_1.Category.find()
            .skip(skip)
            .limit(size).select("-_v");
        // Get total category count for pagination info
        const totalCategories = yield Category_1.Category.countDocuments();
        return res.status(200).json({
            responseCode: 200,
            responseMessage: "Categories retrieved successfully",
            data: {
                categories,
                pagination: {
                    totalCategories,
                    currentPage: page,
                    pageSize: size,
                    totalPages: Math.ceil(totalCategories / size),
                },
            },
        });
    }
    catch (err) {
        console.error("Error fetching categories:", err);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal Server Error",
            data: null,
        });
    }
});
exports.getAllCategories = getAllCategories;
