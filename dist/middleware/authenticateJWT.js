"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConfig_1 = require("../utils/envConfig");
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
