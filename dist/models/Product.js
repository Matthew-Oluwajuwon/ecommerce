"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const productSchema = new Schema({
    productName: {
        type: String,
        min: 3,
        trim: true,
        required: true,
        unique: true
    },
    productDescription: {
        type: String,
        min: 3,
        trim: true,
        required: true,
    },
    productImage: {
        type: String,
        min: 3,
        trim: true,
        required: true,
    },
    productPrice: {
        type: Number,
        min: 0,
        trim: true,
        required: true,
    },
    productQuantity: {
        type: Number,
        min: 0,
        trim: true,
        required: true,
    },
    productCategory: {
        type: String,
        trim: true,
        enum: [
            "IPHONE_5_SERIES",
            "IPHONE_6_SERIES",
            "IPHONE_7_SERIES",
            "IPHONE_8_SERIES",
            "IPHONE_X_SERIES",
            "IPHONE_11_SERIES",
            "IPHONE_12_SERIES",
            "IPHONE_13_SERIES",
            "IPHONE_14_SERIES",
            "IPHONE_15_SERIES",
            "IPHONE_16_SERIES",
        ],
        required: true,
    },
}, {
    timestamps: true,
});
exports.Product = mongoose_1.default.model("Product", productSchema);
