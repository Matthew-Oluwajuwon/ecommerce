"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const categorySchema = new Schema({
    name: {
        type: String,
        minlength: 3, // Change from 'min' to 'minlength'
        required: true
    },
}, {
    timestamps: true,
});
exports.Category = mongoose_1.default.model("Category", categorySchema);
