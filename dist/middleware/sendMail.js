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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const envConfig_1 = require("../utils/envConfig");
const transporter_1 = require("../utils/transporter");
const sendEmail = (to, subject, text, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield transporter_1.transporter.sendMail({
            from: envConfig_1.emailUser, // Sender address
            to: to, // List of receivers (comma-separated)
            subject: subject, // Subject line
            text: text, // Plain text body
            html: html, // HTML body (optional)
        });
        console.log(`Email sent: ${info.messageId}`);
    }
    catch (error) {
        console.error(`Error sending email: ${error}`);
    }
});
exports.sendEmail = sendEmail;
