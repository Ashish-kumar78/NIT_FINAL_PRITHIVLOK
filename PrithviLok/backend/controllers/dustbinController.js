// ============================================================
// Dustbin Controller
// ============================================================
import Dustbin from '../models/Dustbin.js';
import User from '../models/User.js';
import { addEcoPoints } from '../utils/ecoScore.js';

/**
 * @route   GET /api/dustbins
 * @desc    Get all dustbins (with optional filters)
 */
export const getDustbins = async (req, res) => {
  try {
    const { type, status, isRecyclingCenter, lat, lng, radius } = req.query;
    const filter = { verificationStatus: { $ne: 'rejected' } };

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (isRecyclingCenter) filter.isRecyclingCenter = isRecyclingCenter === 'true';

    // Geo query: find dustbins near coordinates
    if (lat && lng) {
      const radiusInMeters = (radius || 5) * 1000; // default 5km
      filter.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radiusInMeters,
        },
      };
    }

    const dustbins = await Dustbin.find(filter)
      .populate('reportedBy', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(200);

    res.json(dustbins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/dustbins/:id
 * @desc    Get a single dustbin
 */
export const getDustbinById = async (req, res) => {
  try {
    const dustbin = await Dustbin.findById(req.params.id)
      .populate('reportedBy', 'name avatar')
      .populate('reports.user', 'name avatar');

    if (!dustbin) {
      return res.status(404).json({ message: 'Dustbin not found' });
    }

    res.json(dustbin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/dustbins
 * @desc    Add a new dustbin — triggers admin notification
 */
export const createDustbin = async (req, res) => {
  try {
    const { latitude, longitude, address, type, isRecyclingCenter } = req.body;

    if (!latitude || !longitude || !address) {
      return res.status(400).json({ message: 'Latitude, longitude, and address are required' });
    }

    // ── Spam Prevention: max 5 reports/hour per user ────────
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await Dustbin.countDocuments({
      reportedBy: req.user._id,
      createdAt: { $gte: oneHourAgo },
    });
    if (recentCount >= 5) {
      return res.status(429).json({
        message: '⚠️ You can submit max 5 reports per hour. Please wait before submitting again.',
      });
    }

    const dustbin = await Dustbin.create({
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      address,
      type: type || 'general',
      photo: req.file ? `/uploads/${req.file.filename}` : '',
      reportedBy: req.user._id,
      isRecyclingCenter: isRecyclingCenter === 'true',
      verificationStatus: 'pending',
    });

    // ❌ NO eco points here — points only awarded after admin verification

    // Increment user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { dustbinsReported: 1 },
    });

    // ── Real-time: notify EVERYONE about new dustbin ────────
    const io = req.app.get('io');
    if (io) {
      io.emit('dustbin:new', {
        dustbin,
        addedBy: req.user.name,
      });

      // ── Real-time: notify ADMIN ROOM specifically ─────────
      io.to('admin_room').emit('admin:newReport', {
        _id: dustbin._id,
        type: dustbin.type,
        address: dustbin.address,
        photo: dustbin.photo,
        location: dustbin.location,
        verificationStatus: 'pending',
        createdAt: dustbin.createdAt,
        reportedBy: {
          _id: req.user._id,
          name: req.user.name,
          ecoPoints: req.user.ecoScore || 0,
        },
      });
    }

    res.status(201).json({
      message: '📩 Report submitted! Pending admin verification. Points will be awarded after approval.',
      dustbin,
      status: 'pending',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/**
 * @route   POST /api/dustbins/:id/report
 * @desc    Report an issue with a dustbin
 */
export const reportDustbin = async (req, res) => {
  try {
    const { issue, description } = req.body;
    const dustbin = await Dustbin.findById(req.params.id);

    if (!dustbin) {
      return res.status(404).json({ message: 'Dustbin not found' });
    }

    dustbin.reports.push({
      user: req.user._id,
      issue: issue || 'other',
      description: description || '',
    });

    // Update status if overflow/damaged
    if (issue === 'overflow' || issue === 'damaged') {
      dustbin.status = issue;
    }

    await dustbin.save();

    // Award eco points for reporting
    const ecoResult = await addEcoPoints(req.user, 'REPORT_GARBAGE');

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('dustbin:report', {
        dustbinId: dustbin._id,
        issue,
        reportedBy: req.user.name,
      });
    }

    res.json({
      message: 'Issue reported successfully!',
      dustbin,
      ecoPoints: ecoResult,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/dustbins/:id/rate
 * @desc    Rate a dustbin's cleanliness
 */
export const rateDustbin = async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const dustbin = await Dustbin.findById(req.params.id);
    if (!dustbin) {
      return res.status(404).json({ message: 'Dustbin not found' });
    }

    dustbin.ratingSum += rating;
    dustbin.totalRatings += 1;
    dustbin.cleanlinessRating = Math.round(dustbin.ratingSum / dustbin.totalRatings);

    await dustbin.save();

    res.json({
      message: 'Rating submitted!',
      cleanlinessRating: dustbin.cleanlinessRating,
      totalRatings: dustbin.totalRatings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   DELETE /api/dustbins/:id
 * @desc    Delete a dustbin (only by reporter)
 */
export const deleteDustbin = async (req, res) => {
  try {
    const dustbin = await Dustbin.findById(req.params.id);

    if (!dustbin) {
      return res.status(404).json({ message: 'Dustbin not found' });
    }

    if (dustbin.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this dustbin' });
    }

    await Dustbin.findByIdAndDelete(req.params.id);

    res.json({ message: 'Dustbin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
