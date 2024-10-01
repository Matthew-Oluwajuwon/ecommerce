import { Request, Response } from "express";
import { User } from "../../models/User"; // Import your User model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { secretKey } from "../../utils/envConfig";
import Joi from "joi";

// Login Controller
export const login = async (req: Request, res: Response) => {
  const schema = Joi.object({
    email_address: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "string.empty": "Email is required",
    }),
    password: Joi.string().min(8).required().messages({
      "string.min": "Password must be at least 8 characters long",
      "string.empty": "Password is required",
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
  
  const { email_address, password } = req.body;
  try {
    const user = await User.findOne({ email_address });

    if (!user) {
      return res.status(401).json({
        responseCode: 401,
        responseMessage: "Invalid credentials",
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        responseCode: 401,
        responseMessage: "Invalid credentials",
        data: null,
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email_address: user.email_address,
        role_type: user.role_type,
        is_approved: user.is_approved,
        is_default_password: user.is_default_password
      },
      secretKey as string,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      responseCode: 200,
      responseMessage: "Login successfully",
      is_default_password: user.is_default_password,
      token,
    });
  } catch (error: any) {
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "Internal server error",
      error: error.message,
      data: null,
    });
  }
};
