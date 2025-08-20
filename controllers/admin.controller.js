// import Product from '../models/Product.js';

// export const dashboard = async (req,res) => {
//   const count = await Product.countDocuments({});
//   res.render('admin/dashboard', { title: 'Admin', count });
// };

// export const adminProducts = async (req,res) => {
//   const items = await Product.find().sort('-createdAt');
//   res.render('admin/products', { title: 'Admin Products', items });
// };

// export const newProductForm = (req,res)=> res.render('admin/new-product', { title: 'New Product' });

// export const createProduct = async (req,res) => {
//   const { title, price, mrp, brand, category, description, images } = req.body;
//   const imgs = images ? images.split(',').map(s=>s.trim()).filter(Boolean) : [];
//   await Product.create({ title, price, mrp, brand, category, description, images: imgs });
//   res.redirect('/admin/products');
// };

// export const editProductForm = async (req,res) => {
//   const p = await Product.findById(req.params.id);
//   if (!p) return res.redirect('/admin/products');
//   res.render('admin/edit-product', { title: 'Edit Product', p });
// };

// export const updateProduct = async (req,res) => {
//   const { title, price, mrp, brand, category, description, images, active } = req.body;
//   const imgs = images ? images.split(',').map(s=>s.trim()).filter(Boolean) : [];
//   await Product.findByIdAndUpdate(req.params.id, { title, price, mrp, brand, category, description, images: imgs, active: !!active });
//   res.redirect('/admin/products');
// };

// export const deleteProduct = async (req,res) => {
//   await Product.findByIdAndDelete(req.params.id);
//   res.redirect('/admin/products');
// };




// trying to add crud functions

import * as productService from '../services/productService.js';

export const dashboard = async (req, res) => {
  const count = await productService.countProducts();
  res.render('admin/dashboard', { title: 'Admin', count });
};

export const adminProducts = async (req, res) => {
  const items = await productService.getAllProducts();
  res.render('admin/products', { title: 'Admin Products', items });
};

export const newProductForm = (req, res) => res.render('admin/new-product', { title: 'New Product' });

export const createProduct = async (req, res) => {
  const { title, price, mrp, brand, category, description, images } = req.body;
  const imgs = images ? images.split(',').map(s => s.trim()).filter(Boolean) : [];
  await productService.createProduct({ title, price, mrp, brand, category, description, images: imgs });
  res.redirect('/admin/products');
};

export const editProductForm = async (req, res) => {
  const p = await productService.getProductById(req.params.id);
  if (!p) return res.redirect('/admin/products');
  res.render('admin/edit-product', { title: 'Edit Product', p });
};

export const updateProduct = async (req, res) => {
  const { title, price, mrp, brand, category, description, images, active } = req.body;
  const imgs = images ? images.split(',').map(s => s.trim()).filter(Boolean) : [];
  await productService.updateProduct(req.params.id, { title, price, mrp, brand, category, description, images: imgs, active: !!active });
  res.redirect('/admin/products');
};

export const deleteProduct = async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.redirect('/admin/products');
};

