// ============================================================
// Dynamic NFT Upgrade Logic
// ============================================================
import { getEcoLevel } from './ecoScore.js';

/**
 * Determine if a user's NFT should be upgraded
 * @param {object} user - User document
 * @returns {object} NFT upgrade info
 */
export const checkNFTUpgrade = (user) => {
  const currentLevel = getEcoLevel(user.ecoScore);

  // Map eco levels to NFT levels
  const nftLevelMap = {
    'Seed': 1,
    'Sapling': 2,
    'Tree': 3,
    'Forest Guardian': 4,
  };

  const currentNFTLevel = nftLevelMap[user.ecoLevel] || 1;
  const newNFTLevel = currentLevel.nftLevel;

  return {
    shouldUpgrade: newNFTLevel > currentNFTLevel,
    currentLevel: currentNFTLevel,
    newLevel: newNFTLevel,
    levelName: currentLevel.name,
    user: user._id,
    walletAddress: user.walletAddress,
  };
};

/**
 * Get NFT metadata based on level
 * @param {number} level - NFT level (1-4)
 * @returns {object} NFT metadata
 */
export const getNFTMetadata = (level) => {
  const metadata = {
    1: {
      name: 'PrithviLok Seed',
      description: 'A seedling of sustainability — your journey begins!',
      image: 'ipfs://seed-nft-image',
      attributes: [
        { trait_type: 'Level', value: 'Seed' },
        { trait_type: 'Tier', value: 1 },
        { trait_type: 'Rarity', value: 'Common' },
      ],
    },
    2: {
      name: 'PrithviLok Sapling',
      description: 'Growing strong — your impact is blooming!',
      image: 'ipfs://sapling-nft-image',
      attributes: [
        { trait_type: 'Level', value: 'Sapling' },
        { trait_type: 'Tier', value: 2 },
        { trait_type: 'Rarity', value: 'Uncommon' },
      ],
    },
    3: {
      name: 'PrithviLok Tree',
      description: 'A mighty tree of change — your roots run deep!',
      image: 'ipfs://tree-nft-image',
      attributes: [
        { trait_type: 'Level', value: 'Tree' },
        { trait_type: 'Tier', value: 3 },
        { trait_type: 'Rarity', value: 'Rare' },
      ],
    },
    4: {
      name: 'PrithviLok Forest Guardian',
      description: 'Guardian of the forest — a true champion of Earth!',
      image: 'ipfs://forest-guardian-nft-image',
      attributes: [
        { trait_type: 'Level', value: 'Forest Guardian' },
        { trait_type: 'Tier', value: 4 },
        { trait_type: 'Rarity', value: 'Legendary' },
      ],
    },
  };

  return metadata[level] || metadata[1];
};
