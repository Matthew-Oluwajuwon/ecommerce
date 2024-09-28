import { Request, Response } from "express";
import { Product } from "../../models/Product";

// Get Single Product Controller
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find product by ID
    const product = await Product.findById(id).select("-__v");;

    if (!product) {
      return res.status(404).json({
        responseCode: 404,
        responseMessage: "Product not found",
        data: null,
      });
    }

    return res.status(200).json({
      responseCode: 200,
      responseMessage: "Product retrieved successfully",
      data: product,
    });
  } catch (err) {
    console.error("Error fetching product:", err);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "Internal Server Error",
      data: null,
    });
  }
};
