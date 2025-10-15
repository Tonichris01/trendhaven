import { useState, useEffect } from "react";
import { toast } from "sonner";
import { OutfitUpload } from "./OutfitUpload";
import { WardrobeGrid } from "./WardrobeGrid";
import { RecommendationPanel } from "./RecommendationPanel";
import { getUserOutfits, type Outfit } from "../lib/api/outfits";
import { getCurrentUser } from "../lib/api/auth";

type Tab = "upload" | "wardrobe" | "recommendations";

export function FashionAssistant() {
  const [activeTab, setActiveTab] = useState<Tab>("upload");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshOutfits = async () => {
    try {
      setLoading(true);
      console.log('🔄 Refreshing outfits...');
      
      const currentUser = await getCurrentUser();
      console.log('👤 Current user:', currentUser);
      
      if (!currentUser) {
        console.log('❌ No current user, clearing outfits');
        setOutfits([]);
        return;
      }
      
      console.log('📡 Calling getUserOutfits...');
      const data = await getUserOutfits({
        category: selectedCategory === "all" ? undefined : selectedCategory as any
      });
      console.log('✅ Got outfits data:', data);
      setOutfits(data);
    } catch (error) {
      console.error('❌ Failed to refresh outfits:', error);
      toast.error('Failed to refresh outfits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshOutfits();
  }, [selectedCategory]);

  // Refresh outfits when switching to wardrobe tab
  useEffect(() => {
    if (activeTab === "wardrobe") {
      refreshOutfits();
    }
  }, [activeTab]);

  const tabs = [
    { id: "upload" as Tab, label: "Upload Outfit", icon: "📸" },
    { id: "wardrobe" as Tab, label: "Smart Wardrobe", icon: "👗" },
    { id: "recommendations" as Tab, label: "Recommendations", icon: "✨" }
  ];

  const categories = [
    { id: "all", label: "All Outfits" },
    { id: "casual", label: "Casual" },
    { id: "formal", label: "Formal" },
    { id: "street", label: "Street" },
    { id: "party", label: "Party" },
    { id: "business", label: "Business" },
    { id: "athletic", label: "Athletic" }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-purple-100 dark:border-purple-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[60vh]">
        {activeTab === "upload" && <OutfitUpload onUploadSuccess={refreshOutfits} />}
        
        {activeTab === "wardrobe" && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
            
            <WardrobeGrid outfits={outfits} loading={loading} />
          </div>
        )}
        
        {activeTab === "recommendations" && <RecommendationPanel />}
      </div>
    </div>
  );
}
