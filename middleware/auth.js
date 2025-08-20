export const requireLogin = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login?next=' + encodeURIComponent(req.originalUrl));
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/login');
  next();
};
