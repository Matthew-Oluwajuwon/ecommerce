import { Request, Response } from "express";
import { SubCategory } from "../../models/SubCategory";

export const getAllSubCategoryByCategoryId = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  try {
    const subCategories = await SubCategory.find({ category: categoryId }).populate('category');

    if (subCategories.length === 0) {
      return res.status(404).json({
        responseCode: 404,
        responseMessage: 'No sub-categories found for this category',
        data: null,
      });
    }

    res.status(200).json({
      responseCode: 200,
      responseMessage: 'Sub-categories fetched successfully',
      data: subCategories,
    });
  } catch (error) {
    res.status(500).json({
      responseCode: 500,
      responseMessage: 'Internal Server Error',
      data: null,
    });
  }
};
