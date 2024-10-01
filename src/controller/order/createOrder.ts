import { Response } from "express";
import { Cart } from "../../models/Cart";
import { Order } from "../../models/Order";
import { User } from "../../models/User"; // Assuming User model is available
import axios from "axios";
import { flutterWaveApiBaseUrl, flutterWaveSecretKey, paystackApiUrl, paystackSecretKey } from "../../utils/envConfig";
import Joi from "joi";

// Create Order Controller
export const createOrder = async (req: any, res: Response) => {
    const origin = req.headers.origin;
    const { id: userId } = req.user

    // Define the shippingAddress schema
    const shippingAddressSchema = Joi.object({
      street: Joi.string().min(3).required(), // Require a minimum length for street
      city: Joi.string().min(3).required(),   // Require a minimum length for city
      postalCode: Joi.string().min(3).required(), // Require a minimum length for postalCode
      country: Joi.string().min(2).required(), // Require a minimum length for country
    });

    // Define the main schema
    const orderSchema = Joi.object({
      isHomeAddress: Joi.boolean().required(), // isHomeAddress must be a boolean
      paymentMethod: Joi.string().valid('PAYSTACK', 'FLUTTER_WAVE').required(), // Payment method must be "PAYSTACK"
      callback_url: Joi.string().uri().required(), // Ensure callback_url is a valid URI
      shippingAddress: shippingAddressSchema.optional(), // shippingAddress is optional
    });

    const { error } = orderSchema.validate(req.body)

    if (error) {
      return res.status(400).json({
        responseCode: 400,
        responseMessage: error.details[0].message?.replace(/\"/g, ""),
        data: null,
      });
    }

    
    try {
      const { shippingAddress, isHomeAddress, callback_url, paymentMethod } = req.body;

        // Verify if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "User not found.",
                data: null,
            });
        }

        // Fetch the cart details
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: "Your cart is empty.",
                data: null,
            });
        }

        if (!isHomeAddress && !shippingAddress) {
          return res.status(400).json({
            responseCode: 400,
            responseMessage: "You need to pass shipping address or select if you want to use your home address",
            data: null,
        });
        }

        // Determine the shipping address based on isHomeAddress flag
        const finalShippingAddress = isHomeAddress ? user.home_address : shippingAddress;

        // Calculate total amount
        const totalAmount = cart.items.reduce(
            (total, item: any) => total + item.product.productPrice * item.quantity,
            0
        );

        // Create the order
        const order = new Order({
            userId, 
            items: cart.items.map((item: any) => ({
                productId: item.product._id,
                quantity: item.quantity,
                price: item.product.productPrice,
            })),
            totalAmount,
            shippingAddress: finalShippingAddress,
            status: 'pending', // Order status starts as pending
        });

        // Save order to database
        await order.save();

        // Initiate payment using Paystack
        const paystackData = {
            email: user.email_address, // Assuming email is in the User model
            amount: totalAmount * 100, // Paystack uses the lowest currency unit (kobo for NGN)
            reference: order._id.toString(), // Use the order ID as the payment reference
            callback_url: callback_url || origin
        };

        // Initiate payment using Flutterwave
        const flutterwaveData = {
          tx_ref: order._id.toString(),
          amount: totalAmount * 100,
          currency: "NGN",
          redirect_url: callback_url || origin,
          customer: {
             email: user.email_address,
             phone_number: user.phone_number || "",
             name: user.first_name + " " + user.last_name || ""
          }
       }

        const config = {
            headers: {
                Authorization: `Bearer ${ paymentMethod === "FLUTTER_WAVE" ? flutterWaveSecretKey : paystackSecretKey}`,
            },
        };

        // Paystack payment response
        const paymentResponse = await axios.post(
           paymentMethod === "FLUTTER_WAVE" ? (flutterWaveApiBaseUrl +  "payments") : (paystackApiUrl + 'initialize'),
           paymentMethod === "FLUTTER_WAVE" ? flutterwaveData : paystackData,
            config
        );

        const paymentUrl = paymentResponse.data.data.authorization_url || paymentResponse.data.data.link;

        // Return the payment link to the client
        return res.status(201).json({
            responseCode: 201,
            responseMessage: "Order created successfully. Proceed to payment.",
            data: {
                order,
                paymentUrl,
            },
        });
    } catch (err: any) {
        console.error("Error creating order:", err);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal Server Error",
            data: null,
        });
    }
};
