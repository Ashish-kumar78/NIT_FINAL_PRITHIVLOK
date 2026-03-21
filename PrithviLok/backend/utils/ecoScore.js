// ============================================================
// Eco Impact Score Engine
// ============================================================

// Points configuration
export const ECO_POINTS = {
  ADD_DUSTBIN: 25,
  REPORT_GARBAGE: 15,
  COMPLETE_LESSON: 20,
  COMMUNITY_POST: 5,
  DAILY_LOGIN: 2,
};

// Level thresholds
export const ECO_LEVELS = {
  SEED: { name: 'Seed', minScore: 0, nftLevel: 1 },
  SAPLING: { name: 'Sapling', minScore: 50, nftLevel: 2 },
  TREE: { name: 'Tree', minScore: 200, nftLevel: 3 },
  FOREST_GUARDIAN: { name: 'Forest Guardian', minScore: 500, nftLevel: 4 },
};

/**
 * Calculate the eco level based on total score
 * @param {number} score - Total eco impact score
 * @returns {object} Level info { name, nftLevel }
 */
export const getEcoLevel = (score) => {
  if (score >= ECO_LEVELS.FOREST_GUARDIAN.minScore) return ECO_LEVELS.FOREST_GUARDIAN;
  if (score >= ECO_LEVELS.TREE.minScore) return ECO_LEVELS.TREE;
  if (score >= ECO_LEVELS.SAPLING.minScore) return ECO_LEVELS.SAPLING;
  return ECO_LEVELS.SEED;
};

/**
 * Add points to a user and update their level
 * @param {object} user - Mongoose user document
 * @param {string} action - Action type (ADD_DUSTBIN, REPORT_GARBAGE, etc.)
 * @returns {object} Updated user info
 */
export const addEcoPoints = async (user, action) => {
  const points = ECO_POINTS[action] || 0;
  user.ecoScore += points;

  const newLevel = getEcoLevel(user.ecoScore);
  const previousLevel = user.ecoLevel;
  user.ecoLevel = newLevel.name;

  await user.save();

  return {
    pointsEarned: points,
    totalScore: user.ecoScore,
    level: newLevel.name,
    nftLevel: newLevel.nftLevel,
    leveledUp: previousLevel !== newLevel.name,
  };
};
