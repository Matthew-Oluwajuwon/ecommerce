import { Request, Response } from "express";
import { generateRandomPassword } from "../../utils/randomPassword";
import { User } from "../../models/User";
// import { sendEmail } from "../../middleware/sendMail";
import Joi from "joi";
import bcrypt from "bcryptjs"; // Make sure to install bcryptjs

export const forgotPassword = async (req: Request, res: Response) => {
  const { email_address } = req.body;

  const schema = Joi.object({
    email_address: Joi.string().email().min(3).required(), // Marked as required
  });

  const { error } = schema.validate({ email_address });
  if (error) {
    return res.status(400).json({
      responseCode: 400,
      responseMessage: error.details[0].message?.replace(/\"/g, ""),
      data: null,
    });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email_address });

    if (!user) {
      return res.status(404).json({
        responseCode: 404,
        responseMessage: "User not found",
        data: null,
      });
    }

    // Generate a new random password
    const newPassword = generateRandomPassword();

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword; // Update the user's password with the hashed password
    user.is_default_password = true
    await user.save();

    // Send email to user with the new password
    // await sendEmail(
    //   user.email_address,
    //   "FORGOT PASSWORD",
    //   "Here's your default password",
    //   `Your new default password is: ${newPassword}`
    // );

    return res.status(200).json({
      responseCode: 200,
      responseMessage: `A default password has been sent to ${user.email_address}`,
      data: {
        default_password: newPassword
      },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "Internal Server Error",
      data: null,
    });
  }
};
