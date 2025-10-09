"use client";
import { useState } from "react";
import { toast } from "sonner";
import { signInWithEmail, signUpWithEmail, signInAnonymously } from "./lib/api/auth";

export function SignInForm() {
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-form-field"
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;

          try {
            if (flow === "signIn") {
              await signInWithEmail(email, password);
              toast.success("Signed in successfully!");
            } else {
              await signUpWithEmail(email, password);
              toast.success("Account created successfully!");
            }
          } catch (error: any) {
            let toastTitle = "";
            if (error.message.includes("Supabase not configured")) {
              toastTitle = "Database not configured. Please set up Supabase first.";
            } else if (error.message.includes("Invalid password") || error.message.includes("Invalid login credentials")) {
              toastTitle = "Invalid email or password. Please try again.";
            } else if (error.message.includes("User already registered")) {
              toastTitle = "User already exists. Please sign in instead.";
            } else {
              toastTitle =
                flow === "signIn"
                  ? "Could not sign in, did you mean to sign up?"
                  : "Could not sign up, did you mean to sign in?";
            }
            toast.error(toastTitle);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <input
          className="auth-input-field"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
          className="auth-input-field"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button className="auth-button" type="submit" disabled={submitting}>
          {flow === "signIn" ? "Sign in" : "Sign up"}
        </button>
        <div className="text-center text-sm text-secondary">
          <span>
            {flow === "signIn"
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <button
            type="button"
            className="text-primary hover:text-primary-hover hover:underline font-medium cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </button>
        </div>
      </form>
      <div className="flex items-center justify-center my-3">
        <hr className="my-4 grow border-gray-200" />
        <span className="mx-4 text-secondary">or</span>
        <hr className="my-4 grow border-gray-200" />
      </div>
      <button 
        className="auth-button" 
        onClick={async () => {
          try {
            await signInAnonymously();
            toast.success("Signed in anonymously!");
          } catch (error: any) {
            if (error.message.includes("Supabase not configured")) {
              toast.error("Database not configured. Please set up Supabase first.");
            } else {
              toast.error("Failed to sign in anonymously");
            }
          }
        }}
      >
        Sign in anonymously
      </button>
    </div>
  );
}
