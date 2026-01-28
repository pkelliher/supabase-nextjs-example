"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function AddInstrumentForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await supabase.from("instruments").insert({ name });

    setName("");
    setLoading(false);

    // simple refresh to re-fetch server data
    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add an instrument"
        className="w-full p-2 rounded bg-slate-700 text-white"
      />
      <button
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 rounded p-2 font-medium"
      >
        {loading ? "Adding..." : "Add Instrument"}
      </button>
    </form>
  );
}
