import { Router } from 'express';
import Product from '../models/Product.js';

const r = Router();
r.get('/products', async (req,res) => {
  const items = await Product.find({ active: true }).limit(100);
  res.json(items);
});
export default r;
