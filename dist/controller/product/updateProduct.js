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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = void 0;
const joi_1 = __importDefault(require("joi"));
const Product_1 = require("../../models/Product");
const Category_1 = require("../../models/Category"); // Import the Category model
const cloudinaryConfig_1 = __importDefault(require("../../utils/cloudinaryConfig"));
const SubCategory_1 = require("../../models/SubCategory");
// Update Product Controller
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        productName: joi_1.default.string().min(3).trim().optional(),
        productDescription: joi_1.default.string().min(3).trim().optional(),
        productImage: joi_1.default.string().min(3).trim().optional(),
        productPrice: joi_1.default.number().min(0).optional(),
        productQuantity: joi_1.default.number().min(0).optional(),
        productCategoryId: joi_1.default.string().optional(),
        productSubCategoryId: joi_1.default.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            responseCode: 400,
            responseMessage: error.details[0].message.replace(/\"/g, ""),
            data: null,
        });
    }
    try {
        const { id } = req.params;
        // Check if the user role_type and isApproved (if MERCHANT)
        const user = req.user; // Assuming the `user` is attached to the request after JWT authentication
        // Check if the user is an admin
        if (user.role_type !== "ADMIN") {
            // If the user is not an admin, check if they are a merchant and approved
            if (user.role_type !== "MERCHANT" || !user.is_approved) {
                return res.status(403).json({
                    responseCode: 403,
                    responseMessage: "Only approved merchants or admin users can update products.",
                    data: null,
                });
            }
        }
        // Find product by ID
        const product = yield Product_1.Product.findById(id);
        if (!product) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "Product not found",
                data: null,
            });
        }
        const updateData = Object.assign({}, req.body);
        // Check if productCategoryId is provided and fetch the corresponding category
        if (req.body.productCategoryId) {
            const category = yield Category_1.Category.findById(req.body.productCategoryId);
            if (!category) {
                return res.status(400).json({
                    responseCode: 400,
                    responseMessage: "Invalid category ID.",
                    data: null,
                });
            }
            updateData.productCategory = category._id; // Set productCategory to the category's ObjectId
        }
        // Fetch the subcategory using the provided productSubCategoryId
        const subCategory = yield SubCategory_1.SubCategory.findById(req.body.productSubCategoryId);
        if (!subCategory) {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: "Invalid subcategory ID.",
                data: null,
            });
        }
        // Check if the category exists in the subcategory
        if (subCategory.category.toString() !== req.body.productCategoryId) {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: "The provided category does not match the subcategory.",
                data: null,
            });
        }
        // Check if a new image is uploaded, and upload to Cloudinary
        if (req.body.productImage) {
            let uploadResult;
            try {
                uploadResult = yield cloudinaryConfig_1.default.uploader.upload(req.body.productImage);
                updateData.productImage = uploadResult.secure_url;
            }
            catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return res.status(500).json({
                    responseCode: 500,
                    responseMessage: `Uploading image failed: ${uploadError.message}`,
                    data: null,
                });
            }
        }
        // Update the product document
        const updatedProduct = yield Product_1.Product.findByIdAndUpdate(id, updateData, { new: true }).populate('productCategory'); // Populate category
        return res.status(200).json({
            responseCode: 200,
            responseMessage: "Product updated successfully",
            data: updatedProduct,
        });
    }
    catch (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal Server Error",
            data: null,
        });
    }
});
exports.updateProduct = updateProduct;
