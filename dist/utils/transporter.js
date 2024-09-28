"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const envConfig_1 = require("./envConfig");
// Configure the email transporter
exports.transporter = nodemailer_1.default.createTransport({
    service: 'hotmail', // You can replace 'gmail' with your email provider's service name
    port: 587,
    secure: false,
    auth: {
        user: envConfig_1.emailUser, // Your email address
        pass: envConfig_1.emailPassword, // Your email password or App-specific password for Gmail
    },
    tls: {
        rejectUnauthorized: false
    }
});
