"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    firstName: {
        type: String,
        min: 3,
        trim: true,
    },
    lastName: {
        type: String,
        min: 3,
        trim: true,
    },
    email_address: {
        type: String,
        min: 3,
        trim: true,
        required: true,
        unique: true,
    },
    phone_number: {
        type: String,
        min: 10,
        trim: true,
    },
    home_address: {
        type: String,
        min: 3,
        trim: true,
    },
    password: {
        type: String,
        min: 3,
        trim: true,
        required: true
    },
    profile_image: {
        type: String,
        trim: true,
    },
    role_type: {
        type: String,
        enum: ["ADMIN", "MERCHANT", "USER"],
        default: "USER", // Initial role is user
    },
}, {
    timestamps: true,
});
exports.User = mongoose_1.default.model("User", userSchema);
