
import { Request, Response } from "express";
import { User } from "../../models/User"; // Adjust the import based on your user model location
import bcrypt from "bcryptjs"; // Make sure to use bcrypt for hashing passwords
import Joi from 'joi';

export const changePasswordSchema = Joi.object({
  email_address: Joi.string().email().required(),
  default_password: Joi.string().min(8).required(), // Adjust length as needed
  new_password: Joi.string().min(8).required() // Adjust length and criteria as needed
});

export const changePassword = async (req: Request, res: Response) => {
    // Validate the request body against the Joi schema
    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        responseCode: 400,
        responseMessage: error.details[0].message?.replace(/\"/g, ""),
        data: null,
      });
    }
  
    const { email_address, default_password, new_password } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email_address });
      if (!user) {
        return res.status(404).json({
          responseCode: 404,
          responseMessage: "User not found",
          data: null,
        });
      }
  
      // Check if the provided generated password matches the user's password
      const isMatch = await bcrypt.compare(default_password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          responseCode: 400,
          responseMessage: "Generated password is incorrect",
          data: null,
        });
      }
  
      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(new_password, 10);
      user.password = hashedNewPassword; // Update the user's password
      user.is_default_password = false
      await user.save();
  
      return res.status(200).json({
        responseCode: 200,
        responseMessage: "Password changed successfully",
        data: null,
      });
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({
        responseCode: 500,
        responseMessage: "Internal Server Error",
        data: null,
      });
    }
  };
