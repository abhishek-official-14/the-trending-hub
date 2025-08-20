import { Router } from 'express';
import {
  home, products, productDetail,
  showLogin, showSignup, login, signup, logout,
  viewCart, addToCart, updateCartQty, removeFromCart, clearCart,
  showCheckout, placeOrder, thankyou, myOrders
} from '../controllers/page.controller.js';
import { requireLogin } from '../middleware/auth.js';

const r = Router();

r.get('/', home);
r.get('/products', products);
r.get('/product/:id', productDetail);

// auth
r.get('/login', showLogin);
r.post('/login', login);
r.get('/signup', showSignup);
r.post('/signup', signup);
r.post('/logout', logout);

// cart
r.get('/cart', viewCart);
r.post('/cart/add', addToCart);
r.post('/cart/qty', updateCartQty);
r.post('/cart/remove', removeFromCart);
r.post('/cart/clear', clearCart);

// checkout/orders
r.get('/checkout', requireLogin, showCheckout);
r.post('/checkout', requireLogin, placeOrder);
r.get('/thankyou', requireLogin, thankyou);
r.get('/order-history', requireLogin, myOrders);

export default r;
