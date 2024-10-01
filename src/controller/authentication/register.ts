import { Request, Response } from "express";
import Joi from "joi";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../../utils/cloudinaryConfig";

import { User } from "../../models/User"; // Assuming you have a User model for MongoDB
import { secretKey } from "../../utils/envConfig";

const register = async (req: Request, res: Response) => {
  // Define the validation schema using Joi
  const schema = Joi.object({
    first_name: Joi.string().min(3).optional().messages({
      "string.min": "First name must be at least 3 characters long",
    }),
    last_name: Joi.string().min(3).optional().messages({
      "string.min": "Last name must be at least 3 characters long",
    }),
    phone_number: Joi.string().min(10).optional().messages({
      "string.min": "Phone number must be at least 10 characters long",
    }),
    home_address: Joi.string().min(3).optional().messages({
      "string.min": "Home address must be at least 3 characters long",
    }),
    profile_image: Joi.string().optional(),
    email_address: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "string.empty": "Email is required",
    }),
    password: Joi.string().min(8).required().messages({
      "string.min": "Password must be at least 8 characters long",
      "string.empty": "Password is required",
    }),
    role_type: Joi.string().valid("ADMIN", "MERCHANT", "USER").required().messages({
      "any.only": "Role type must be one of ADMIN, MERCHANT, or USER",
      "string.empty": "Role type is required",
    }),
  });

  // Validate the request body against the schema
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      responseCode: 400,
      responseMessage: error.details[0].message?.replace(/\"/g, ""),
      data: null,
    });
  }

  const {
    email_address,
    password,
    role_type,
    first_name,
    last_name,
    phone_number,
    home_address,
    profile_image,
  } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email_address });
    if (existingUser) {
      return res.status(409).json({
        responseCode: 409,
        responseMessage: "User with this email already exists",
        data: null,
      });
    }

    // Upload the image to Cloudinary
    let uploadResult: any;

    if (profile_image) {
      try {
        uploadResult = await cloudinary.uploader.upload(profile_image);
      } catch (uploadError: any) {
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
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
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, role_type: newUser.role_type }, // Payload
      secretKey as string, // Secret key
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
  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "Internal Server Error",
      data: null,
    });
  }
};

export default register;
