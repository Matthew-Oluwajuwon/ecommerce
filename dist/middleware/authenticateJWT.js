"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConfig_1 = require("../utils/envConfig");
const jwt_decode_1 = require("jwt-decode");
// Middleware to validate JWT token
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, envConfig_1.secretKey, (err, user) => {
            if (err) {
                return res.status(403).json({
                    responseCode: 403,
                    responseMessage: "Forbidden request",
                    data: null,
                });
            }
            // Token is valid, store user info for further use
            const decoded = (0, jwt_decode_1.jwtDecode)(token);
            if (decoded.is_default_password) {
                return res.status(403).json({
                    responseCode: 403,
                    responseMessage: "You need to change your password as you cannot use a default password to proceed.",
                    data: null,
                });
            }
            req.user = user;
            next();
        });
    }
    else {
        return res.status(401).json({
            responseCode: 401,
            responseMessage: "Unauthorized request",
            data: null,
        });
    }
};
exports.default = authenticateJWT;
