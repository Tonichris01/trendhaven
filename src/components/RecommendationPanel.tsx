import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getRecommendations, getUserOutfits, type Outfit } from "../lib/api/outfits";

export function RecommendationPanel() {
  const [mood, setMood] = useState("");
  const [occasion, setOccasion] = useState("");
  const [weather, setWeather] = useState("");
  const [recommendations, setRecommendations] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [outfits, setOutfits] = useState<Outfit[]>([]);

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const data = await getUserOutfits();
        setOutfits(data);
      } catch (error) {
        console.error('Failed to fetch outfits:', error);
      }
    };

    fetchOutfits();
  }, []);

  const handleGetRecommendations = async () => {
    if (!outfits || outfits.length === 0) {
      toast.error("Upload some outfits first to get recommendations");
      return;
    }

    setIsLoading(true);
    try {
      const recs = await getRecommendations({
        mood: mood || undefined,
        occasion: occasion || undefined,
        weather: weather || undefined
      });
      setRecommendations(recs);
      
      if (recs.length === 0) {
        toast.info("No recommendations found. Try different criteria.");
      } else {
        toast.success(`Found ${recs.length} recommendations for you!`);
      }
    } catch (error) {
      toast.error("Failed to get recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  const presetMoods = ["Confident", "Playful", "Professional", "Relaxed", "Elegant", "Edgy"];
  const presetOccasions = ["Work", "Date", "Party", "Casual", "Meeting", "Weekend"];
  const presetWeather = ["Sunny", "Rainy", "Cold", "Hot", "Mild"];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Get Outfit Recommendations
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Tell us about your mood, occasion, or weather for personalized suggestions
        </p>
      </div>

      {/* Recommendation Form */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 dark:border-purple-800">
        <div className="space-y-6">
          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              How are you feeling?
            </label>
            <div className="flex flex-wrap gap-2">
              {presetMoods.map((presetMood) => (
                <button
                  key={presetMood}
                  onClick={() => setMood(mood === presetMood ? "" : presetMood)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    mood === presetMood
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-white/60 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-600/80"
                  }`}
                >
                  {presetMood}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Or type your own mood..."
              className="mt-2 w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Occasion Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              What's the occasion?
            </label>
            <div className="flex flex-wrap gap-2">
              {presetOccasions.map((presetOccasion) => (
                <button
                  key={presetOccasion}
                  onClick={() => setOccasion(occasion === presetOccasion ? "" : presetOccasion)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    occasion === presetOccasion
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-white/60 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-600/80"
                  }`}
                >
                  {presetOccasion}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="Or describe the occasion..."
              className="mt-2 w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Weather Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              What's the weather like?
            </label>
            <div className="flex flex-wrap gap-2">
              {presetWeather.map((presetWeatherOption) => (
                <button
                  key={presetWeatherOption}
                  onClick={() => setWeather(weather === presetWeatherOption ? "" : presetWeatherOption)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    weather === presetWeatherOption
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-white/60 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-600/80"
                  }`}
                >
                  {presetWeatherOption}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              placeholder="Or describe the weather..."
              className="mt-2 w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Get Recommendations Button */}
          <button
            onClick={handleGetRecommendations}
            disabled={isLoading || !outfits || outfits.length === 0}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Getting recommendations...</span>
              </div>
            ) : (
              "Get Recommendations ✨"
            )}
          </button>
        </div>
      </div>

      {/* Recommendations Results */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recommended Outfits
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((outfit, index) => (
              <div
                key={outfit.id}
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-100 dark:border-purple-800 hover:shadow-xl transition-all duration-300"
              >
                {/* Recommendation Rank */}
                <div className="relative">
                  <div className="absolute top-3 left-3 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                    {index + 1}
                  </div>
                  
                  {/* Image */}
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700">
                    {outfit.image_url ? (
                      <img
                        src={outfit.image_url}
                        alt="Recommended outfit"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-4xl">👗</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium capitalize">
                      {outfit.category}
                    </span>
                    <span className="text-sm font-semibold text-purple-600">
                      {outfit.rating}/10
                    </span>
                  </div>

                  {/* Tags */}
                  {outfit.style_analysis.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {outfit.style_analysis.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {outfit.style_analysis.feedback}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!outfits || outfits.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">✨</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No outfits to recommend
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Upload some outfits first to get personalized recommendations
          </p>
        </div>
      ) : recommendations.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-300">
            Set your preferences above and click "Get Recommendations" to see suggested outfits
          </p>
        </div>
      )}
    </div>
  );
}
