import { Request, Response } from "express";
import { User } from "../../models/User"; // Import your User model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { secretKey } from "../../utils/envConfig";

// Login Controller
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

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
        email: user.email_address,
        role_type: user.role_type,
        isApproved: user.isApproved,
      },
      secretKey as string,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      responseCode: 200,
      responseMessage: "Login successfully",
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
