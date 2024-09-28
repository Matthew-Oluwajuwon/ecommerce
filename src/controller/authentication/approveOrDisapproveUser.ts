import { Response } from "express";
import { User } from "../../models/User"; // Assuming you have a User model

// Approve or Disapprove User Controller
export const approveOrDisapproveUser = async (req: any, res: Response) => {
  const { userId, status } = req.body; // Assuming status is passed in the body

  // Check if the user making the request is an admin
  const requester = req.user; // Assuming the user is attached to the request after JWT authentication
  console.log(requester)
  if (!requester || requester.role_type !== "ADMIN") {
    return res.status(403).json({
      responseCode: 403,
      responseMessage: "Only admins can approve or disapprove users.",
      data: null,
    });
  }

  if (!userId || !status) {
    return res.status(400).json({
      responseCode: 400,
      responseMessage: "User ID and status are required.",
      data: null,
    });
  }

  if (status !== "APPROVED" && status !== "DISAPPROVED") {
    return res.status(400).json({
      responseCode: 400,
      responseMessage: "Status must be either 'APPROVED' or 'DISAPPROVED'.",
      data: null,
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        responseCode: 404,
        responseMessage: "User not found.",
        data: null,
      });
    }

    user.isApproved = status === "APPROVED"; // Toggle isApproved based on status

    await user.save();

    return res.status(200).json({
      responseCode: 200,
      responseMessage: `User has been ${status.toLowerCase()}.`,
      data: user,
    });
  } catch (err) {
    console.error("Error approving or disapproving user:", err);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "Internal Server Error",
      data: null,
    });
  }
};
