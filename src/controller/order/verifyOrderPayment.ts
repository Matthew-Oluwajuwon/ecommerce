import { Request, Response } from "express";
import axios from "axios";
import { Order } from "../../models/Order";
import { flutterWaveSecretKey, paystackApiUrl, paystackSecretKey } from "../../utils/envConfig";

// Verify Payment Controller
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { reference, paymentMethod } = req.query;

    if (!reference || typeof reference !== 'string') {
      return res.status(400).json({
        responseCode: 400,
        responseMessage: "Reference is required and must be a string.",
        data: null,
      });
    }

    if (!paymentMethod || typeof paymentMethod !== 'string') {
      return res.status(400).json({
        responseCode: 400,
        responseMessage: "Payment method is required and must be a string.",
        data: null,
      });
    }

    let paymentData;

    if (paymentMethod === 'PAYSTACK') {
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

      paymentData = paystackResponse.data.data;

      // Check if the payment was successful
      if (paymentData.status !== "success") {
        return res.status(400).json({
          responseCode: 400,
          responseMessage: "Payment verification failed.",
          data: null,
        });
      }
    } else if (paymentMethod === 'FLUTTER_WAVE') {
      // Make a direct GET request to Flutterwave to verify the payment using tx_ref
      const flutterwaveUrl = `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${reference}`;
      const flutterwaveResponse = await axios.get(flutterwaveUrl, {
        headers: {
          Authorization: `Bearer ${flutterWaveSecretKey}`,
        },
      });
      paymentData = flutterwaveResponse.data;

      // Check if the payment was successful
      if (paymentData.status !== "success") {
        return res.status(400).json({
          responseCode: 400,
          responseMessage: "Payment verification failed.",
          data: null,
        });
      }
    } else {
      return res.status(400).json({
        responseCode: 400,
        responseMessage: "Invalid payment method.",
        data: null,
      });
    }

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
        data: paymentData,
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
