// ============================================================
// StatCard Component
// ============================================================

const StatCard = ({ icon: Icon, label, value, color = 'green', subtext }) => {
  const colorMap = {
    green: 'text-green-400 bg-green-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    yellow: 'text-yellow-400 bg-yellow-500/10',
    red: 'text-red-400 bg-red-500/10',
    teal: 'text-teal-400 bg-teal-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
  };

  const iconClass = colorMap[color] || colorMap.green;

  return (
    <div className="card card-hover">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${iconClass} flex items-center justify-center`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
      {subtext && <p className="text-xs text-gray-600 mt-1">{subtext}</p>}
    </div>
  );
};

export default StatCard;
