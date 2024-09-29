import { Request, Response } from 'express';
import { SubCategory } from '../../models/SubCategory';

export const getAllSubCategories = async (_req: Request, res: Response) => {
  try {
    const subCategories = await SubCategory.find().populate('category'); // Populate category details
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

