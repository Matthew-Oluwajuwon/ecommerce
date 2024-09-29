import { Request, Response } from "express";
import { Product } from "../../models/Product";

// Get All Products with Pagination Controller
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    let { page = 1, size = 10 } = req.query;

    // Convert query params to numbers and enforce limit
    page = parseInt(page as string, 10);
    size = Math.min(parseInt(size as string, 10), 100); // Maximum size is 100

    const skip = (page - 1) * size;

    // Fetch products with pagination
    const products = await Product.find()
      .skip(skip)
      .limit(size).select("-_v");

    // Get total product count for pagination info
    const totalProducts = await Product.countDocuments();

    return res.status(200).json({
      responseCode: 200,
      responseMessage: "Products retrieved successfully",
      data: {
        products,
        pagination: {
          totalProducts,
          currentPage: page,
          pageSize: size,
          totalPages: Math.ceil(totalProducts / size),
        },
      },
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "Internal Server Error",
      data: null,
    });
  }
};
