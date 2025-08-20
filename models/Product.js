import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  mrp: { type: Number },
  brand: { type: String, default: '' },
  category: { type: String, index: true },
  images: [{ type: String }],
  stock: { type: Number, default: 100 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
