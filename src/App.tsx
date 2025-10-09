import { useState, useEffect } from "react";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { FashionAssistant } from "./components/FashionAssistant";
import { getCurrentUser, onAuthStateChange } from "./lib/api/auth";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-purple-100 dark:border-purple-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FA</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              TrendHaven
            </h1>
          </div>
          <SignOutButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Content />
      </main>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }
        }}
      />
    </div>
  );
}

function Content() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    getCurrentUser().then(setUser).catch(() => setUser(null)).finally(() => setLoading(false));

    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-pink-600 rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {!user ? (
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              Your AI Fashion Assistant
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Upload your outfits, get AI-powered style ratings, and receive personalized fashion recommendations
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <SignInForm />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 dark:border-purple-800">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-xl">📸</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Outfit Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Get detailed ratings on style, color coordination, and trend alignment</p>
            </div>
            
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 dark:border-purple-800">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-xl">👗</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Wardrobe</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Automatically categorize and organize your outfits for easy access</p>
            </div>
            
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 dark:border-purple-800">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-xl">✨</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Personalized Recommendations</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Get outfit suggestions based on mood, occasion, and preferences</p>
            </div>
          </div>
        </div>
      ) : (
        <FashionAssistant key={user?.id} />
      )}
    </div>
  );
}
