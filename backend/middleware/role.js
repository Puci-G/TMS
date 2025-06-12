module.exports = (...allowed) => (req, _res, next) => {
  if (!allowed.includes(req.user.role)) {
    return _res.status(403).json({ message: 'Forbidden' });
  }
  next();
};
