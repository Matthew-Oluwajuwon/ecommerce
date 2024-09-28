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
exports.approveOrDisapproveUser = void 0;
const User_1 = require("../../models/User"); // Assuming you have a User model
// Approve or Disapprove User Controller
const approveOrDisapproveUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, status } = req.body; // Assuming status is passed in the body
    // Check if the user making the request is an admin
    const requester = req.user; // Assuming the user is attached to the request after JWT authentication
    console.log(requester);
    if (!requester || requester.role_type !== "ADMIN") {
        return res.status(403).json({
            responseCode: 403,
            responseMessage: "Only admins can approve or disapprove users.",
            data: null,
        });
    }
    if (!userId || !status) {
        return res.status(400).json({
            responseCode: 400,
            responseMessage: "User ID and status are required.",
            data: null,
        });
    }
    if (status !== "APPROVED" && status !== "DISAPPROVED") {
        return res.status(400).json({
            responseCode: 400,
            responseMessage: "Status must be either 'APPROVED' or 'DISAPPROVED'.",
            data: null,
        });
    }
    try {
        const user = yield User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "User not found.",
                data: null,
            });
        }
        user.isApproved = status === "APPROVED"; // Toggle isApproved based on status
        yield user.save();
        return res.status(200).json({
            responseCode: 200,
            responseMessage: `User has been ${status.toLowerCase()}.`,
            data: user,
        });
    }
    catch (err) {
        console.error("Error approving or disapproving user:", err);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal Server Error",
            data: null,
        });
    }
});
exports.approveOrDisapproveUser = approveOrDisapproveUser;
