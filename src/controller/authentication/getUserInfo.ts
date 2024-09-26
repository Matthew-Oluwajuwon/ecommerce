import { Response } from "express";
import { User } from "../../models/User"; // Adjust the import according to your project structure

// Get User Information Controller
export const getUserInfo = async (req: any, res: Response) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select("-password -_id -__v"); // Exclude password from the result

    if (!user) {
      return res.status(404).json({
        responseCode: 500,
        responseMessage: "User not found",
        data: null,
      });
    }

    return res.status(200).json({
      responseCode: 200,
      responseMessage: "User information retrieved",
      data: user,
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
