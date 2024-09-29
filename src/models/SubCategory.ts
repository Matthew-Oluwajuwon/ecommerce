// models/SubCategory.js
import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
  subCategoryName: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Reference to the Category model
    required: true,
  },
}, { timestamps: true });

export const SubCategory = mongoose.model('SubCategory', subCategorySchema);

