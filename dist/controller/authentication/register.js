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
const joi_1 = __importDefault(require("joi"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinaryConfig_1 = __importDefault(require("../../utils/cloudinaryConfig"));
const User_1 = require("../../models/User"); // Assuming you have a User model for MongoDB
const envConfig_1 = require("../../utils/envConfig");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Define the validation schema using Joi
    const schema = joi_1.default.object({
        first_name: joi_1.default.string().min(3).optional().messages({
            "string.min": "First name must be at least 3 characters long",
        }),
        last_name: joi_1.default.string().min(3).optional().messages({
            "string.min": "Last name must be at least 3 characters long",
        }),
        phone_number: joi_1.default.string().min(10).optional().messages({
            "string.min": "Phone number must be at least 10 characters long",
        }),
        home_address: joi_1.default.string().min(3).optional().messages({
            "string.min": "Home address must be at least 3 characters long",
        }),
        profile_image: joi_1.default.string().optional(),
        email_address: joi_1.default.string().email().required().messages({
            "string.email": "Please provide a valid email address",
            "string.empty": "Email is required",
        }),
        password: joi_1.default.string().min(8).required().messages({
            "string.min": "Password must be at least 8 characters long",
            "string.empty": "Password is required",
        }),
        role_type: joi_1.default.string().valid("ADMIN", "MERCHANT", "USER").required().messages({
            "any.only": "Role type must be one of ADMIN, MERCHANT, or USER",
            "string.empty": "Role type is required",
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
    const { email_address, password, role_type, first_name, last_name, phone_number, home_address, profile_image, } = req.body;
    try {
        // Check if the user already exists
        const existingUser = yield User_1.User.findOne({ email_address });
        if (existingUser) {
            return res.status(409).json({
                responseCode: 409,
                responseMessage: "User with this email already exists",
                data: null,
            });
        }
        // Upload the image to Cloudinary
        let uploadResult;
        if (profile_image) {
            try {
                uploadResult = yield cloudinaryConfig_1.default.uploader.upload(profile_image);
            }
            catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return res.status(500).json({
                    responseCode: 500,
                    responseMessage: `Uploading image failed: ${uploadError.message}`,
                    error: uploadError.message,
                    data: null,
                });
            }
        }
        // Hash the password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Create a new user
        const newUser = new User_1.User({
            email_address,
            password: hashedPassword,
            role_type,
            first_name, // Optional fields
            last_name, // Optional fields
            phone_number, // Optional fields
            home_address, // Optional fields
            profile_image: uploadResult ? uploadResult.secure_url : null, // Assign uploaded image URL
            isApproved: role_type === "ADMIN",
            is_default_password: false
        });
        // Save the user to the database
        yield newUser.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: newUser._id, role_type: newUser.role_type }, // Payload
        envConfig_1.secretKey, // Secret key
        { expiresIn: "1h" } // Token expiration
        );
        // Send the response
        return res.status(201).json({
            responseCode: 201,
            responseMessage: "User registered successfully",
            data: {
                email_address: newUser.email_address,
                role_type: newUser.role_type,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                phone_number: newUser.phone_number,
                home_address: newUser.home_address,
                profile_image: newUser.profile_image,
                created_at: newUser.createdAt,
                is_approved: newUser.is_approved,
                is_default_password: false,
                token,
            },
        });
    }
    catch (err) {
        console.error("Error registering user:", err);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal Server Error",
            data: null,
        });
    }
});
exports.default = register;
