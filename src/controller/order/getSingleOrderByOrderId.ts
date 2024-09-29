import { Response } from "express";
import { Order } from "../../models/Order";

// Get Single Order by Order ID Controller
export const getSingleOrderByOrderId = async (req: any, res: Response) => {
     // Check if the user role_type and isApproved (if MERCHANT)
     const user = req.user as any; // Assuming the `user` is attached to the request after JWT authentication

     // Check if the user is an admin
     if (user.role_type !== "ADMIN") {
       // If the user is not an admin, check if they are a merchant and approved
         return res.status(403).json({
           responseCode: 403,
           responseMessage: "Only approved admin users can view single order.",
           data: null,
         });
     }
     
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId).populate('userId');
  
      if (!order) {
        return res.status(404).json({
          responseCode: 404,
          responseMessage: "Order not found.",
          data: null,
        });
      }
  
      return res.status(200).json({
        responseCode: 200,
        responseMessage: "Order retrieved successfully.",
        data: order,
      });
    } catch (err) {
      console.error("Error fetching order by ID:", err);
      return res.status(500).json({
        responseCode: 500,
        responseMessage: "Internal Server Error",
        data: null,
      });
    }
  };
  