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
exports.changePassword = exports.changePasswordSchema = void 0;
const User_1 = require("../../models/User"); // Adjust the import based on your user model location
const bcryptjs_1 = __importDefault(require("bcryptjs")); // Make sure to use bcrypt for hashing passwords
const joi_1 = __importDefault(require("joi"));
exports.changePasswordSchema = joi_1.default.object({
    email_address: joi_1.default.string().email().required(),
    default_password: joi_1.default.string().min(8).required(), // Adjust length as needed
    new_password: joi_1.default.string().min(8).required() // Adjust length and criteria as needed
});
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Validate the request body against the Joi schema
    const { error } = exports.changePasswordSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            responseCode: 400,
            responseMessage: (_a = error.details[0].message) === null || _a === void 0 ? void 0 : _a.replace(/\"/g, ""),
            data: null,
        });
    }
    const { email_address, default_password, new_password } = req.body;
    try {
        // Check if the user exists
        const user = yield User_1.User.findOne({ email_address });
        if (!user) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "User not found",
                data: null,
            });
        }
        // Check if the provided generated password matches the user's password
        const isMatch = yield bcryptjs_1.default.compare(default_password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: "Generated password is incorrect",
                data: null,
            });
        }
        // Hash the new password
        const hashedNewPassword = yield bcryptjs_1.default.hash(new_password, 10);
        user.password = hashedNewPassword; // Update the user's password
        user.is_default_password = false;
        yield user.save();
        return res.status(200).json({
            responseCode: 200,
            responseMessage: "Password changed successfully",
            data: null,
        });
    }
    catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal Server Error",
            data: null,
        });
    }
});
exports.changePassword = changePassword;
