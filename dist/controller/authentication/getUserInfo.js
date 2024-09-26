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
exports.getUserInfo = void 0;
const User_1 = require("../../models/User"); // Adjust the import according to your project structure
// Get User Information Controller
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const user = yield User_1.User.findById(userId).select("-password -_id -__v"); // Exclude password from the result
        if (!user) {
            return res.status(404).json({
                responseCode: 500,
                responseMessage: "User not found",
                data: null,
            });
        }
        return res.status(200).json({
            responseCode: 200,
            responseMessage: "User information retrieved",
            data: user,
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
exports.getUserInfo = getUserInfo;
