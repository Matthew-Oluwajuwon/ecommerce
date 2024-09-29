import { Request, Response } from "express";
import axios from "axios";
import { Order } from "../../models/Order";
import { paystackApiUrl, paystackSecretKey } from "../../utils/envConfig";

// Verify Payment Controller
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;

    // Make a request to Paystack to verify the payment
    const config = {
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    };

    const paystackResponse = await axios.get(
      `${paystackApiUrl}verify/${reference}`,
      config
    );

    const paymentData = paystackResponse.data.data;

    // Check if the payment was successful
    if (paymentData.status === "success") {
      // Find the order using the reference (order ID)
      const order = await Order.findById(reference);

      if (!order) {
        return res.status(404).json({
          responseCode: 404,
          responseMessage: "Order not found.",
          data: null,
        });
      }

      // Update order status to paid
      order.status = "paid";
      await order.save();

      return res.status(200).json({
        responseCode: 200,
        responseMessage: "Payment verified successfully.",
        data: {
          order,
          paymentData,
        },
      });
    } else {
      return res.status(400).json({
        responseCode: 400,
        responseMessage: "Payment verification failed.",
        data: null,
      });
    }
  } catch (err: any) {
    console.error("Error verifying payment:", err);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "Internal Server Error",
      data: null,
    });
  }
};
