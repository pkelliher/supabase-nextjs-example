"use client";

import { useState } from "react";
import { supabaseClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

const supabase = supabaseClient();

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Check your email to confirm!");
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      router.push("/instruments");
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Login / Sign Up</h1>

        {message && <p className="mb-4 text-yellow-400">{message}</p>}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-white"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 rounded hover:bg-green-500"
            >
              Sign In
            </button>
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
