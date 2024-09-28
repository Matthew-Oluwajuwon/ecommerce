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
exports.createProduct = void 0;
const joi_1 = __importDefault(require("joi"));
const Product_1 = require("../../models/Product");
const cloudinaryConfig_1 = __importDefault(require("../../utils/cloudinaryConfig"));
// Create Product Controller
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        productName: joi_1.default.string().min(3).trim().required(),
        productDescription: joi_1.default.string().min(3).trim().required(),
        productImage: joi_1.default.string().min(3).trim().required(),
        productPrice: joi_1.default.number().min(0).required(),
        productQuantity: joi_1.default.number().min(0).required(),
        productCategory: joi_1.default.string()
            .valid("IPHONE_5_SERIES", "IPHONE_6_SERIES", "IPHONE_7_SERIES", "IPHONE_8_SERIES", "IPHONE_X_SERIES", "IPHONE_11_SERIES", "IPHONE_12_SERIES", "IPHONE_13_SERIES", "IPHONE_14_SERIES", "IPHONE_15_SERIES", "IPHONE_16_SERIES")
            .required(),
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
        // Check if the user role_type and isApproved (if MERCHANT)
        const user = req.user; // Assuming the `user` is attached to the request after JWT authentication
        // Check if the user is an admin
        if (user.role_type !== "ADMIN") {
            // If the user is not an admin, check if they are a merchant and approved
            if (user.role_type !== "MERCHANT" || !user.isApproved) {
                return res.status(403).json({
                    responseCode: 403,
                    responseMessage: "Only approved merchants or admin users can create products.",
                    data: null,
                });
            }
        }
        // Check if productName already exists
        const existingProduct = yield Product_1.Product.findOne({ productName: req.body.productName });
        if (existingProduct) {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: "Product name already exists.",
                data: null,
            });
        }
        // Upload the image to Cloudinary
        let uploadResult;
        try {
            uploadResult = yield cloudinaryConfig_1.default.uploader.upload(req.body.productImage);
        }
        catch (uploadError) {
            console.error("Cloudinary upload error:", uploadError);
            return res.status(500).json({
                responseCode: 500,
                responseMessage: `Uploading image failed: ${uploadError.message}`,
                error: uploadError.message,
                data: null,
            });
        }
        const product = new Product_1.Product(Object.assign(Object.assign({}, req.body), { productImage: uploadResult.secure_url }));
        yield product.save();
        return res.status(201).json({
            responseCode: 201,
            responseMessage: "Product created successfully",
            data: product,
        });
    }
    catch (err) {
        console.error("Error creating product:", err);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal Server Error",
            data: null,
        });
    }
});
exports.createProduct = createProduct;
