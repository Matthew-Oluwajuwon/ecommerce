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
// Login Controller
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.User.findOne({ email });
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
            email: user.email_address,
            role_type: user.role_type,
            isApproved: user.isApproved,
        }, envConfig_1.secretKey, {
            expiresIn: "1h",
        });
        return res.status(200).json({
            responseCode: 200,
            responseMessage: "Login successfully",
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
