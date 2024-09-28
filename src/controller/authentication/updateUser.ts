import { Response } from "express";
import Joi from "joi";
import bcrypt from "bcryptjs";
import cloudinary from "../../utils/cloudinaryConfig";
import { User } from "../../models/User"; // Assuming you have a User model

export const updateUser = async (req: any, res: Response) => {
    const userId = req.user.id;
  // Define the validation schema for user profile update
  const schema = Joi.object({
    firstName: Joi.string().min(3).optional(),
    lastName: Joi.string().min(3).optional(),
    phone_number: Joi.string().min(10).optional(),
    home_address: Joi.string().min(3).optional(),
    profile_image: Joi.string().optional(), // base64 string
    password: Joi.string().min(8).optional(),
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

  try {
    const { firstName, lastName, phone_number, home_address, profile_image } = req.body;

    // Find the user (assuming you're identifying by email or use req.user for authenticated users)
    const user = await User.findById(userId);
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
        uploadResult = await cloudinary.uploader.upload(profile_image);
      } catch (uploadError: any) {
        return res.status(500).json({
          responseCode: 500,
          responseMessage: `Error uploading image: ${uploadError.message}`,
          data: null,
        });
      }
    }

    // Update user details
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone_number) user.phone_number = phone_number;
    if (home_address) user.home_address = home_address;
    if (uploadResult) user.profile_image = uploadResult.secure_url;

    // Save the updated user to the database
    await user.save();

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
  } catch (err) {
    console.error("Error updating user profile:", err);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "Internal Server Error",
      data: null,
    });
  }
};
