import { Response } from "express";
import { Order } from "../../models/Order";

// Get Single Order by User ID and Order ID Controller
export const getSingleOrderByUserIdAndOrderId = async (req: any, res: Response) => {
    const user = req.user as any;
    try {
      const { orderId } = req.params;
      const order = await Order.findOne({ userId: user.id, _id: orderId }).populate('userId');
  
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
      console.error("Error fetching order by user ID and order ID:", err);
      return res.status(500).json({
        responseCode: 500,
        responseMessage: "Internal Server Error",
        data: null,
      });
    }
  };
  