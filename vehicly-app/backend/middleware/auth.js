const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

const admin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });
  next();
};

module.exports = { auth, admin };