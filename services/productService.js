import Product from '../models/Product.js';

export const getAllProducts = async () => {
  return await Product.find().sort('-createdAt');
};

export const getProductById = async (id) => {
  return await Product.findById(id);
};

export const createProduct = async (productData) => {
  return await Product.create(productData);
};

export const updateProduct = async (id, updateData) => {
  return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

export const countProducts = async () => {
  return await Product.countDocuments({});
};
