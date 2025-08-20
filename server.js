import express from 'express';
import expressLayouts from "express-ejs-layouts";
import path from 'path';

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { connectDB } from './config/db.js';
import pageRoutes from './routes/pages.js';
import adminRoutes from './routes/admin.js';
import apiRoutes from './routes/api.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set("layout", "layout"); // default layout file ka naam

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionSecret = process.env.SESSION_SECRET || 'secret';
const mongoUri = process.env.MONGO_URI;
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000*60*60*24*7 },
  store: mongoUri ? MongoStore.create({ mongoUrl: mongoUri }) : undefined
}));

// Make session vars available to templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.cartCount = (req.session.cart?.reduce((s,i)=>s+i.qty,0)) || 0;
  next();
});

connectDB();

// routes
app.use('/', pageRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

// 404
app.use((req,res)=> res.status(404).render('404', { title: 'Not Found' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Web app running on http://localhost:${PORT}`));
