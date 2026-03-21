// ============================================================
// Admin Controller
// ============================================================
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Dustbin from '../models/Dustbin.js';
import User from '../models/User.js';

const signToken = (id) =>
  jwt.sign(
    { id, isAdmin: true },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '8h' }
  );

// ── POST /api/admin/login ─────────────────────────────────────
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const admin = await Admin.findOne({ username: username.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await admin.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      token: signToken(admin._id),
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/admin/me ─────────────────────────────────────────
export const getAdminProfile = async (req, res) => {
  res.json({ admin: req.admin });
};

// ── GET /api/admin/reports ────────────────────────────────────
export const getAllReports = async (req, res) => {
  try {
    const { verificationStatus, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (verificationStatus) filter.verificationStatus = verificationStatus;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [dustbins, total] = await Promise.all([
      Dustbin.find(filter)
        .populate('reportedBy', 'name email ecoPoints ecoLevel')
        .populate('verifiedBy', 'name username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Dustbin.countDocuments(filter),
    ]);

    res.json({
      dustbins,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/admin/stats ──────────────────────────────────────
export const getAdminStats = async (req, res) => {
  try {
    const [total, pending, verified, rejected, totalUsers] = await Promise.all([
      Dustbin.countDocuments(),
      Dustbin.countDocuments({ verificationStatus: 'pending' }),
      Dustbin.countDocuments({ verificationStatus: 'verified' }),
      Dustbin.countDocuments({ verificationStatus: 'rejected' }),
      User.countDocuments(),
    ]);

    res.json({ total, pending, verified, rejected, totalUsers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── PATCH /api/admin/reports/:id/verify ──────────────────────
export const verifyReport = async (req, res) => {
  try {
    const { adminRemark } = req.body;
    const dustbin = await Dustbin.findById(req.params.id).populate('reportedBy', 'name');

    if (!dustbin) return res.status(404).json({ message: 'Dustbin report not found' });
    if (dustbin.verificationStatus === 'verified') {
      return res.status(400).json({ message: 'Already verified' });
    }

    dustbin.verificationStatus = 'verified';
    dustbin.verifiedBy = req.admin._id;
    dustbin.verifiedAt = new Date();
    dustbin.adminRemark = adminRemark || '';
    await dustbin.save();

    // Award eco points to the reporter if not already awarded
    let pointsAwarded = 0;
    if (!dustbin.ecoPointsAwarded && dustbin.reportedBy) {
      const reporter = await User.findById(dustbin.reportedBy._id || dustbin.reportedBy);
      if (reporter) {
        reporter.ecoScore = (reporter.ecoScore || 0) + 25;
        pointsAwarded = 25;
        await reporter.save();
        dustbin.ecoPointsAwarded = true;
        await dustbin.save();
      }
    }

    // ── Notify the user via Socket.io ───────────────────────
    const io = req.app.get('io');
    if (io) {
      io.emit('user:reportVerified', {
        dustbinId: dustbin._id,
        userId: (dustbin.reportedBy._id || dustbin.reportedBy).toString(),
        address: dustbin.address,
        type: dustbin.type,
        pointsAwarded,
        adminRemark: dustbin.adminRemark,
      });
    }

    res.json({ message: '✅ Dustbin verified & eco points awarded!', dustbin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── PATCH /api/admin/reports/:id/reject ──────────────────────
export const rejectReport = async (req, res) => {
  try {
    const { adminRemark } = req.body;
    const dustbin = await Dustbin.findById(req.params.id).populate('reportedBy', 'name');

    if (!dustbin) return res.status(404).json({ message: 'Dustbin report not found' });

    dustbin.verificationStatus = 'rejected';
    dustbin.verifiedBy = req.admin._id;
    dustbin.verifiedAt = new Date();
    dustbin.adminRemark = adminRemark || 'Rejected: Invalid or fake report';
    await dustbin.save();

    // ── Notify the user via Socket.io ───────────────────────
    const io = req.app.get('io');
    if (io) {
      io.emit('user:reportRejected', {
        dustbinId: dustbin._id,
        userId: (dustbin.reportedBy._id || dustbin.reportedBy).toString(),
        address: dustbin.address,
        type: dustbin.type,
        adminRemark: dustbin.adminRemark,
      });
    }

    res.json({ message: '❌ Report rejected.', dustbin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE /api/admin/reports/:id ────────────────────────────
export const deleteReport = async (req, res) => {
  try {
    const dustbin = await Dustbin.findByIdAndDelete(req.params.id);
    if (!dustbin) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Report permanently deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
