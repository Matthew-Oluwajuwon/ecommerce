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
exports.getAllSubCategoryByCategoryId = void 0;
const SubCategory_1 = require("../../models/SubCategory");
const getAllSubCategoryByCategoryId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    try {
        const subCategories = yield SubCategory_1.SubCategory.find({ category: categoryId }).populate('category');
        if (subCategories.length === 0) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: 'No sub-categories found for this category',
                data: null,
            });
        }
        res.status(200).json({
            responseCode: 200,
            responseMessage: 'Sub-categories fetched successfully',
            data: subCategories,
        });
    }
    catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            data: null,
        });
    }
});
exports.getAllSubCategoryByCategoryId = getAllSubCategoryByCategoryId;
