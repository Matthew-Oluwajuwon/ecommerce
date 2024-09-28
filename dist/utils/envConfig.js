"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailUser = exports.emailPassword = exports.secretKey = exports.connectionString = exports.port = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT;
exports.port = port;
const connectionString = process.env.CONNECTION_STRING;
exports.connectionString = connectionString;
const secretKey = process.env.SECRET_KEY;
exports.secretKey = secretKey;
const emailUser = process.env.EMAIL_USER;
exports.emailUser = emailUser;
const emailPassword = process.env.EMAIL_PASSWORD;
exports.emailPassword = emailPassword;
