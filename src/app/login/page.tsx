"use client";

import { useState } from "react";
import { Shield, Chrome } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-light mb-4">
              <Shield className="h-7 w-7 text-navy fill-navy" />
            </div>
            <h1 className="text-2xl font-bold">
              Welcome to SAM<span className="text-navy">Bidder</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to manage your government contract bids
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-11 gap-3 bg-white border border-border text-foreground hover:bg-gray-50 shadow-sm"
            variant="outline"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-navy border-t-transparent" />
            ) : (
              <Chrome className="h-4 w-4" />
            )}
            {loading ? "Redirecting..." : "Continue with Google"}
          </Button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
