import { Response } from "express";
import { Cart } from "../../models/Cart";
import { Order } from "../../models/Order";
import { User } from "../../models/User"; // Assuming User model is available
import axios from "axios";
import { paystackApiUrl, paystackSecretKey } from "../../utils/envConfig";

// Create Order Controller
export const createOrder = async (req: any, res: Response) => {
    const origin = req.headers.origin;
    const { id: userId } = req.user

    try {
        const { shippingAddress, isHomeAddress, callback_url } = req.body;

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

        const config = {
            headers: {
                Authorization: `Bearer ${paystackSecretKey}`,
            },
        };

        const paystackResponse = await axios.post(
            paystackApiUrl + 'initialize',
            paystackData,
            config
        );

        const paymentUrl = paystackResponse.data.data.authorization_url;

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
