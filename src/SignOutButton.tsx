"use client";
import { useState, useEffect } from "react";
import { signOut } from "./lib/api/auth";
import { getCurrentUser } from "./lib/api/auth";

export function SignOutButton() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <button
      className="px-4 py-2 rounded bg-white text-secondary border border-gray-200 font-semibold hover:bg-gray-50 hover:text-secondary-hover transition-colors shadow-sm hover:shadow"
      onClick={async () => {
        try {
          await signOut();
        } catch (error) {
          console.error("Sign out failed:", error);
        }
      }}
    >
      Sign out
    </button>
  );
}
