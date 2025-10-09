import { type Outfit } from "../lib/api/outfits";

interface OutfitCardProps {
  outfit: Outfit;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

export function OutfitCard({ outfit, onSelect, onToggleFavorite }: OutfitCardProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-600";
    if (rating >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getRatingBg = (rating: number) => {
    if (rating >= 8) return "bg-green-100 dark:bg-green-900";
    if (rating >= 6) return "bg-yellow-100 dark:bg-yellow-900";
    return "bg-red-100 dark:bg-red-900";
  };

  return (
    <div className="group relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-100 dark:border-purple-800 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      {/* Image */}
      <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-700">
        {outfit.image_url ? (
          <img
            src={outfit.image_url}
            alt="Outfit"
            className="w-full h-full object-cover cursor-pointer"
            onClick={onSelect}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-4xl">👗</span>
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
            outfit.favorite
              ? "bg-red-500/80 text-white"
              : "bg-white/80 text-gray-400 hover:text-red-500"
          }`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Rating Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold ${getRatingBg(outfit.rating)} ${getRatingColor(outfit.rating)}`}>
          {outfit.rating}/10
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium capitalize">
            {outfit.category}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(outfit.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Tags */}
        {outfit.style_analysis.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {outfit.style_analysis.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {outfit.style_analysis.tags.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                +{outfit.style_analysis.tags.length - 2}
              </span>
            )}
          </div>
        )}

        <button
          onClick={onSelect}
          className="w-full py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
