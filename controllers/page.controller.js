import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import bcrypt from "bcryptjs";

export const home = async (req, res) => {
  const items = await Product.find({ active: true })
    .sort("-createdAt")
    .limit(12);
  res.render("index", { title: "TheTrendingHub", items });
};

export const products = async (req, res) => {
  const { q, category, page = 1, limit = 12 } = req.query;
  const filter = { active: true };
  if (q) filter.title = { $regex: q, $options: "i" };
  if (category) filter.category = category;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, count] = await Promise.all([
    Product.find(filter).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);
  res.render("products", {
    title: "Products",
    items,
    q: q || "",
    category: category || "",
    page: Number(page),
    pages: Math.ceil(count / Number(limit)),
  });
};

export const productDetail = async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).render("404", { title: "Not Found" });
  res.render("product", { title: p.title, p });
};

// Auth
export const showSignup = (req, res) =>
  res.render("signup", { title: "Sign Up" });
export const showLogin = (req, res) => res.render("login", { title: "Login" });

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists)
    return res.render("signup", {
      title: "Sign Up",
      error: "Email already registered",
    });
  const user = await User.create({ name, email, password });
  req.session.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  res.redirect("/login");
};

// export const login = async (req,res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user || !(await user.matchPassword(password))) {
//     return res.render('login', { title: 'Login', error: 'Invalid credentials' });
//   }
//   req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };
//   const next = req.query.next || '/';

//   res.redirect(next);
// };

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.render("login", {
      title: "Login",
      error: "Invalid credentials",
    });
  }
  req.session.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  let redirectUrl;
  if (user.role === "admin") {
    redirectUrl = "/admin/products";
  } else {
    redirectUrl = req.query.next || "/";
  }

  res.redirect(redirectUrl);
};

export const logout = (req, res) => {
  req.session.destroy(() => res.redirect("/"));
};

// Cart in session
export const viewCart = (req, res) => {
  const cart = req.session.cart || [];
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  res.render("cart", { title: "Cart", cart, subtotal });
};
export const addToCart = async (req, res) => {
  const { productId, qty = 1 } = req.body;
  const p = await Product.findById(productId);
  if (!p) return res.redirect("/");
  const cart = req.session.cart || [];
  const idx = cart.findIndex((i) => String(i.productId) === String(productId));
  if (idx >= 0) cart[idx].qty += Number(qty);
  else
    cart.push({
      productId: p._id,
      title: p.title,
      price: p.price,
      image: p.images?.[0],
      qty: Number(qty),
    });
  req.session.cart = cart;
  res.redirect("/cart");
};
export const updateCartQty = (req, res) => {
  const { productId, qty } = req.body;
  const cart = req.session.cart || [];
  const idx = cart.findIndex((i) => String(i.productId) === String(productId));
  if (idx >= 0) cart[idx].qty = Number(qty);
  req.session.cart = cart;
  res.redirect("/cart");
};
export const removeFromCart = (req, res) => {
  const { productId } = req.body;
  const cart = (req.session.cart || []).filter(
    (i) => String(i.productId) != String(productId)
  );
  req.session.cart = cart;
  res.redirect("/cart");
};
export const clearCart = (req, res) => {
  req.session.cart = [];
  res.redirect("/cart");
};

// Checkout & Orders
export const showCheckout = (req, res) => {
  const cart = req.session.cart || [];
  if (!cart.length) return res.redirect("/cart");
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 999 ? 0 : 49;
  const total = subtotal + tax + shipping;
  res.render("checkout", {
    title: "Checkout",
    cart,
    subtotal,
    tax,
    shipping,
    total,
  });
};

export const placeOrder = async (req, res) => {
  const userId = req.session.user.id;
  const cart = req.session.cart || [];
  if (!cart.length) return res.redirect("/cart");
  const items = cart.map((i) => ({
    product: i.productId,
    title: i.title,
    qty: i.qty,
    price: i.price,
    image: i.image,
  }));
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 999 ? 0 : 49;
  const total = subtotal + tax + shipping;
  const shippingAddress = {
    name: req.body.name,
    phone: req.body.phone,
    line1: req.body.line1,
    line2: req.body.line2,
    city: req.body.city,
    state: req.body.state,
    pincode: req.body.pincode,
  };
  const order = await Order.create({
    user: userId,
    items,
    shippingAddress,
    subtotal,
    tax,
    shipping,
    total,
    paymentMethod: req.body.paymentMethod || "COD",
  });
  req.session.cart = [];
  res.redirect("/thankyou?orderId=" + order._id);
};

export const thankyou = (req, res) => {
  res.render("thankyou", { title: "Thank You", orderId: req.query.orderId });
};

export const myOrders = async (req, res) => {
  const orders = await Order.find({ user: req.session.user.id }).sort(
    "-createdAt"
  );
  res.render("order-history", { title: "My Orders", orders });
};
