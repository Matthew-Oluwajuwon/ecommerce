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
exports.login = void 0;
const User_1 = require("../../models/User"); // Import your User model
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConfig_1 = require("../../utils/envConfig");
const joi_1 = __importDefault(require("joi"));
// Login Controller
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const schema = joi_1.default.object({
        email_address: joi_1.default.string().email().required().messages({
            "string.email": "Please provide a valid email address",
            "string.empty": "Email is required",
        }),
        password: joi_1.default.string().min(8).required().messages({
            "string.min": "Password must be at least 8 characters long",
            "string.empty": "Password is required",
        }),
    });
    // Validate the request body against the schema
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            responseCode: 400,
            responseMessage: (_a = error.details[0].message) === null || _a === void 0 ? void 0 : _a.replace(/\"/g, ""),
            data: null,
        });
    }
    const { email_address, password } = req.body;
    try {
        const user = yield User_1.User.findOne({ email_address });
        if (!user) {
            return res.status(401).json({
                responseCode: 401,
                responseMessage: "Invalid credentials",
                data: null,
            });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                responseCode: 401,
                responseMessage: "Invalid credentials",
                data: null,
            });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            email_address: user.email_address,
            role_type: user.role_type,
            is_approved: user.is_approved,
            is_default_password: user.is_default_password
        }, envConfig_1.secretKey, {
            expiresIn: "1h",
        });
        return res.status(200).json({
            responseCode: 200,
            responseMessage: "Login successfully",
            is_default_password: user.is_default_password,
            token,
        });
    }
    catch (error) {
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal server error",
            error: error.message,
            data: null,
        });
    }
});
exports.login = login;
