// ============================================================
// EcoLevel Badge Component
// ============================================================
const levelConfig = {
  'Seed':           { emoji: '🌱', class: 'level-seed' },
  'Sapling':        { emoji: '🌿', class: 'level-sapling' },
  'Tree':           { emoji: '🌳', class: 'level-tree' },
  'Forest Guardian':{ emoji: '🌲', class: 'level-guardian' },
};

const EcoLevelBadge = ({ level, showEmoji = true }) => {
  const cfg = levelConfig[level] || levelConfig['Seed'];
  return (
    <span className={cfg.class}>
      {showEmoji && cfg.emoji} {level}
    </span>
  );
};

export default EcoLevelBadge;
