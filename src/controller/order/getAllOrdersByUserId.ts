import { Response } from "express";
import { Order } from "../../models/Order";


// Get All Orders by User ID Controller
export const getAllOrdersByUserId = async (req: any, res: Response) => {
    const user = req.user as any;

    try {
      const orders = await Order.find({ userId: user.id }).populate('userId');
  
      return res.status(200).json({
        responseCode: 200,
        responseMessage: "Orders retrieved successfully.",
        data: orders,
      });
    } catch (err) {
      console.error("Error fetching orders by user ID:", err);
      return res.status(500).json({
        responseCode: 500,
        responseMessage: "Internal Server Error",
        data: null,
      });
    }
  };
  