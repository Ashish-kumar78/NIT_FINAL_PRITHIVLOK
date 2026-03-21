// ============================================================
// Community Controller
// ============================================================
import CommunityPost from '../models/CommunityPost.js';
import User from '../models/User.js';
import { addEcoPoints } from '../utils/ecoScore.js';

/**
 * @route   GET /api/community/posts
 * @desc    Get all community posts
 */
export const getPosts = async (req, res) => {
  try {
    const { category, tag } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (tag) filter.tags = tag;

    const posts = await CommunityPost.find(filter)
      .populate('author', 'name avatar ecoLevel')
      .populate('comments.author', 'name avatar ecoLevel')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/community/posts
 * @desc    Create a new post
 */
export const createPost = async (req, res) => {
  try {
    const { content, category, tags, ipfsHash } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    // Parse tags if provided as string
    let parsedTags = [];
    if (tags) {
      parsedTags = Array.isArray(tags) ? tags : tags.split(',').map((tag) => tag.trim());
    }

    const post = await CommunityPost.create({
      author: req.user._id,
      content,
      category: category || 'discussion',
      tags: parsedTags,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      ipfsHash: ipfsHash || '',
    });

    // Award eco points for posting
    const ecoResult = await addEcoPoints(req.user, 'COMMUNITY_POST');

    // Increment user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { communityPosts: 1 },
    });

    const populatedPost = await CommunityPost.findById(post._id).populate(
      'author',
      'name avatar ecoLevel'
    );

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('community:post', populatedPost);
    }

    res.status(201).json({
      message: 'Post created successfully',
      post: populatedPost,
      ecoPoints: ecoResult,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/community/posts/:id/like
 * @desc    Like or unlike a post
 */
export const toggleLike = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id;
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      message: isLiked ? 'Post unliked' : 'Post liked',
      likes: post.likes.length,
      isLiked: !isLiked,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/community/posts/:id/comment
 * @desc    Add a comment to a post
 */
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      author: req.user._id,
      content,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    const populatedPost = await CommunityPost.findById(post._id).populate(
      'comments.author',
      'name avatar ecoLevel'
    );

    res.status(201).json({
      message: 'Comment added',
      comments: populatedPost.comments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   DELETE /api/community/posts/:id
 * @desc    Delete own post
 */
export const deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Only author or admin can delete
    const isAdmin = req.user.role === 'admin' || req.user.isAdmin === true;
    if (post.author.toString() !== req.user._id.toString() && !isAdmin) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    await CommunityPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
