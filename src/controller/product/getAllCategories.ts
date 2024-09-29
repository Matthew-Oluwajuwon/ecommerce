import { Request, Response } from "express";
import { Category } from "../../models/Category";

// Get All Categories with Pagination Controller
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    let { page = 1, size = 100 } = req.query;

    // Convert query params to numbers and enforce limit
    page = parseInt(page as string, 10);
    size = Math.min(parseInt(size as string, 10), 10); // Maximum size is 100

    const skip = (page - 1) * size;

    // Fetch categories with pagination
    const categories = await Category.find()
      .skip(skip)
      .limit(size).select("-_v");

    // Get total category count for pagination info
    const totalCategories = await Category.countDocuments();

    return res.status(200).json({
      responseCode: 200,
      responseMessage: "Categories retrieved successfully",
      data: {
        categories,
        pagination: {
          totalCategories,
          currentPage: page,
          pageSize: size,
          totalPages: Math.ceil(totalCategories / size),
        },
      },
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "Internal Server Error",
      data: null,
    });
  }
};
