import { useState, useRef } from "react";
import { toast } from "sonner";
import { createOutfit } from "../lib/api/outfits";

interface OutfitUploadProps {
  onUploadSuccess?: () => void;
}

export function OutfitUpload({ onUploadSuccess }: OutfitUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [mood, setMood] = useState("");
  const [occasion, setOccasion] = useState("");
  const [season, setSeason] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10MB");
      return;
    }

    setIsUploading(true);
    
    try {
      toast.loading("Analyzing your outfit...", { id: "analysis" });
      
      const outfit = await createOutfit({
        image: file,
        mood: mood || undefined,
        occasion: occasion || undefined,
        season: season as any || undefined
      });

      toast.success(
        `Outfit analyzed! Rating: ${outfit.rating}/10`,
        { id: "analysis" }
      );

      // Refresh the wardrobe
      onUploadSuccess?.();

      // Reset form
      setMood("");
      setOccasion("");
      setSeason("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload and analyze outfit. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Upload Your Outfit
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Get AI-powered analysis and ratings for your style
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-2xl p-8 text-center bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-200"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-white text-2xl">📸</span>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {isUploading ? "Uploading..." : "Drop your outfit photo here"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or click to browse files (max 10MB)
            </p>
          </div>
        </div>
      </div>

      {/* Context Form */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Add Context (Optional)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mood
            </label>
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="e.g., confident, playful"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Occasion
            </label>
            <input
              type="text"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="e.g., work meeting, date"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Season
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Select season</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
              <option value="winter">Winter</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
