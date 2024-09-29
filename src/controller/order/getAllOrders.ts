import { Response } from "express";
import { Order } from "../../models/Order";

// Get All Orders Controller
export const getAllOrders = async (req: any, res: Response) => {
     // Check if the user role_type and isApproved (if MERCHANT)
     const user = req.user as any; // Assuming the `user` is attached to the request after JWT authentication

     // Check if the user is an admin
     if (user.role_type !== "ADMIN") {
       // If the user is not an admin, check if they are a merchant and approved
         return res.status(403).json({
           responseCode: 403,
           responseMessage: "Only approved admin users can view all orders.",
           data: null,
         });
     }
     
    try {
      const orders = await Order.find().populate('userId'); // Populate userId for user details
      return res.status(200).json({
        responseCode: 200,
        responseMessage: "Orders retrieved successfully.",
        data: orders,
      });
    } catch (err) {
      console.error("Error fetching all orders:", err);
      return res.status(500).json({
        responseCode: 500,
        responseMessage: "Internal Server Error",
        data: null,
      });
    }
  };
  