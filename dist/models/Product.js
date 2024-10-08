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
        unique: true,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category", // Reference to the Category model
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});
exports.Product = mongoose_1.default.model("Product", productSchema);
