import { useState } from "react";
import { toast } from "sonner";
import { OutfitCard } from "./OutfitCard";
import { toggleFavorite, deleteOutfit, type Outfit } from "../lib/api/outfits";

interface WardrobeGridProps {
  outfits: Outfit[];
  loading?: boolean;
}

export function WardrobeGrid({ outfits, loading }: WardrobeGridProps) {
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);

  const handleToggleFavorite = async (outfitId: string) => {
    try {
      await toggleFavorite(outfitId);
      toast.success("Updated favorite status");
    } catch (error) {
      toast.error("Failed to update favorite");
    }
  };

  const handleDeleteOutfit = async (outfitId: string) => {
    if (!confirm("Are you sure you want to delete this outfit?")) return;
    
    try {
      await deleteOutfit(outfitId);
      toast.success("Outfit deleted");
      setSelectedOutfit(null);
    } catch (error) {
      toast.error("Failed to delete outfit");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading outfits...</p>
      </div>
    );
  }

  if (outfits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-3xl">👗</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No outfits yet
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Upload your first outfit to get started with AI analysis
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {outfits.map((outfit) => (
          <OutfitCard
            key={outfit.id}
            outfit={outfit}
            onSelect={() => setSelectedOutfit(outfit)}
            onToggleFavorite={() => handleToggleFavorite(outfit.id)}
          />
        ))}
      </div>

      {/* Outfit Detail Modal */}
      {selectedOutfit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Outfit Details
                </h3>
                <button
                  onClick={() => setSelectedOutfit(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Image */}
                {selectedOutfit.image_url && (
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={selectedOutfit.image_url}
                      alt="Outfit"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Rating and Category */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-purple-600">
                      {selectedOutfit.rating}/10
                    </span>
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium capitalize">
                      {selectedOutfit.category}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleFavorite(selectedOutfit.id)}
                      className={`p-2 rounded-full transition-colors ${
                        selectedOutfit.favorite
                          ? "text-red-500 hover:text-red-600"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => handleDeleteOutfit(selectedOutfit.id)}
                      className="p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Detailed Scores */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedOutfit.style_analysis.styleScore}/10
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Style</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedOutfit.style_analysis.colorCoordination}/10
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Color</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedOutfit.style_analysis.trendAlignment}/10
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Trends</div>
                  </div>
                </div>

                {/* Tags */}
                {selectedOutfit.style_analysis.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Style Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedOutfit.style_analysis.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feedback */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">AI Feedback</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {selectedOutfit.style_analysis.feedback}
                  </p>
                </div>

                {/* Context */}
                {(selectedOutfit.mood || selectedOutfit.occasion || selectedOutfit.season) && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Context</h4>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      {selectedOutfit.mood && <div>Mood: {selectedOutfit.mood}</div>}
                      {selectedOutfit.occasion && <div>Occasion: {selectedOutfit.occasion}</div>}
                      {selectedOutfit.season && <div>Season: {selectedOutfit.season}</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
