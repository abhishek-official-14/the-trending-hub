import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  title: String,
  qty: Number,
  price: Number,
  image: String
}, { _id: false });

const addressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  line1: String,
  line2: String,
  city: String,
  state: String,
  pincode: String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [orderItemSchema],
  shippingAddress: addressSchema,
  subtotal: Number,
  tax: Number,
  shipping: Number,
  total: Number,
  status: { type: String, enum: ['placed','packed','shipped','delivered','cancelled'], default: 'placed' },
  paymentMethod: { type: String, enum: ['COD','Razorpay'], default: 'COD' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
