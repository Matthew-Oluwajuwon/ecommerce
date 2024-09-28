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
exports.forgotPassword = void 0;
const randomPassword_1 = require("../../utils/randomPassword");
const User_1 = require("../../models/User");
const sendMail_1 = require("../../middleware/sendMail");
const joi_1 = __importDefault(require("joi"));
const bcryptjs_1 = __importDefault(require("bcryptjs")); // Make sure to install bcryptjs
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email_address } = req.body;
    const schema = joi_1.default.object({
        email_address: joi_1.default.string().email().min(3).required(), // Marked as required
    });
    const { error } = schema.validate({ email_address });
    if (error) {
        return res.status(400).json({
            responseCode: 400,
            responseMessage: (_a = error.details[0].message) === null || _a === void 0 ? void 0 : _a.replace(/\"/g, ""),
            data: null,
        });
    }
    try {
        // Find user by email
        const user = yield User_1.User.findOne({ email_address });
        if (!user) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "User not found",
                data: null,
            });
        }
        // Generate a new random password
        const newPassword = (0, randomPassword_1.generateRandomPassword)();
        // Hash the new password before saving
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword; // Update the user's password with the hashed password
        yield user.save();
        // Send email to user with the new password
        yield (0, sendMail_1.sendEmail)(user.email_address, "FORGOT PASSWORD", "Here's your default password", `Your new default password is: ${newPassword}`);
        return res.status(200).json({
            responseCode: 200,
            responseMessage: `A default password has been sent to ${user.email_address}`,
            data: null,
        });
    }
    catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal Server Error",
            data: null,
        });
    }
});
exports.forgotPassword = forgotPassword;
