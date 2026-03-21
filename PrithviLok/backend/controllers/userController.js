// ============================================================
// User Controller
// ============================================================
import User from '../models/User.js';
import { checkNFTUpgrade, getNFTMetadata } from '../utils/nftLogic.js';

/**
 * @route   POST /api/users/redeem
 * @desc    Redeem points for Web3 Tokens
 */
export const redeemPoints = async (req, res) => {
  try {
    const { cost } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.ecoScore < cost) {
      return res.status(400).json({ message: 'Insufficient Eco-Points! Complete more missions to earn points.' });
    }

    // Deduct points safely
    user.ecoScore -= cost;
    await user.save();

    res.json({
      message: `Successfully mapped ${cost} tokens to on-chain smart contract limit!`,
      newScore: user.ecoScore
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/users/profile
 * @desc    Get full user profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('lessonsCompleted', 'title slug chapter points');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check NFT upgrade status
    const nftStatus = checkNFTUpgrade(user);
    const nftMetadata = getNFTMetadata(nftStatus.newLevel);

    res.json({
      user,
      nftStatus,
      nftMetadata,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        ecoScore: user.ecoScore,
        ecoLevel: user.ecoLevel,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   PUT /api/users/wallet
 * @desc    Link wallet address to user
 */
export const linkWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }

    const user = await User.findById(req.user._id);
    user.walletAddress = walletAddress.toLowerCase();
    await user.save();

    res.json({
      message: 'Wallet linked successfully',
      walletAddress: user.walletAddress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/users/eco-stats
 * @desc    Get user eco stats
 */
export const getEcoStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      'ecoScore ecoLevel dustbinsReported lessonsCompleted communityPosts dailyLoginStreak nftTokenId'
    );

    const nftStatus = checkNFTUpgrade(user);
    const nftMetadata = getNFTMetadata(nftStatus.newLevel);

    res.json({
      ecoScore: user.ecoScore,
      ecoLevel: user.ecoLevel,
      dustbinsReported: user.dustbinsReported,
      lessonsCompleted: user.lessonsCompleted.length,
      communityPosts: user.communityPosts,
      dailyLoginStreak: user.dailyLoginStreak,
      nftTokenId: user.nftTokenId,
      nftLevel: nftStatus.newLevel,
      nftMetadata,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
