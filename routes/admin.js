import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { dashboard, adminProducts, newProductForm, createProduct, editProductForm, updateProduct, deleteProduct } from '../controllers/admin.controller.js';

const r = Router();

r.use(requireAdmin);
r.get('/', dashboard);
r.get('/products', adminProducts);
r.get('/products/new', newProductForm);
r.post('/products', createProduct);
r.get('/products/:id/edit', editProductForm);
r.post('/products/:id', updateProduct);
r.post('/products/:id/delete', deleteProduct);

export default r;
