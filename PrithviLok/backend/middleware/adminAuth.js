// ============================================================
// Admin Middleware - protects admin-only routes
// ============================================================
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const adminProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      // Must carry admin flag
      if (!decoded.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
      }

      req.admin = await Admin.findById(decoded.id).select('-password');
      if (!req.admin) {
        return res.status(401).json({ message: 'Admin account not found' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No admin token provided' });
  }
};
