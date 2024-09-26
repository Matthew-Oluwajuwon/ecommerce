import { Request, Response } from "express";
import Joi from "joi";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../../models/User"; // Assuming you have a User model for MongoDB
import { secretKey } from "../../utils/envConfig";

const register = async (req: Request, res: Response) => {
  // Define the validation schema using Joi
  const schema = Joi.object({
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
      data: null
    });
  }

  const { email_address, password, role_type } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email_address: email_address });
    if (existingUser) {
      return res.status(409).json({
        responseCode: 409,
        responseMessage: "User with this email already exists",
        data: null,
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      email_address: email_address,
      password: hashedPassword,
      role_type,
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
        created_at: newUser.createdAt,
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
