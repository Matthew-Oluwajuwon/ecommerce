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
exports.updateUser = void 0;
const joi_1 = __importDefault(require("joi"));
const cloudinaryConfig_1 = __importDefault(require("../../utils/cloudinaryConfig"));
const User_1 = require("../../models/User"); // Assuming you have a User model
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user.id;
    // Define the validation schema for user profile update
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().min(3).optional(),
        lastName: joi_1.default.string().min(3).optional(),
        phone_number: joi_1.default.string().min(10).optional(),
        home_address: joi_1.default.string().min(3).optional(),
        profile_image: joi_1.default.string().optional(), // base64 string
        password: joi_1.default.string().min(8).optional(),
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
    try {
        const { firstName, lastName, phone_number, home_address, profile_image } = req.body;
        // Find the user (assuming you're identifying by email or use req.user for authenticated users)
        const user = yield User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "User not found",
                data: null,
            });
        }
        // If a profile image is provided, upload to Cloudinary
        let uploadResult;
        if (profile_image) {
            try {
                uploadResult = yield cloudinaryConfig_1.default.uploader.upload(profile_image);
            }
            catch (uploadError) {
                return res.status(500).json({
                    responseCode: 500,
                    responseMessage: `Error uploading image: ${uploadError.message}`,
                    data: null,
                });
            }
        }
        // Update user details
        if (firstName)
            user.firstName = firstName;
        if (lastName)
            user.lastName = lastName;
        if (phone_number)
            user.phone_number = phone_number;
        if (home_address)
            user.home_address = home_address;
        if (uploadResult)
            user.profile_image = uploadResult.secure_url;
        // Save the updated user to the database
        yield user.save();
        return res.status(200).json({
            responseCode: 200,
            responseMessage: "User profile updated successfully",
            data: {
                email_address: user.email_address,
                firstName: user.firstName,
                lastName: user.lastName,
                phone_number: user.phone_number,
                home_address: user.home_address,
                profile_image: user.profile_image,
            },
        });
    }
    catch (err) {
        console.error("Error updating user profile:", err);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal Server Error",
            data: null,
        });
    }
});
exports.updateUser = updateUser;
