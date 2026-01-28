"use client";

import { useState } from "react";
import { supabaseClient } from "../lib/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";

const supabase = supabaseClient();

export default function AddInstrumentForm({
  mutate,
  onAdd,
}: {
  mutate: () => void;
  onAdd: (
    instrument: { id: number; name: string } | null,
    error?: PostgrestError | null,
  ) => void;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("instruments")
      .insert({ name })
      .select()
      .single();

    setLoading(false);
    setName("");
    mutate();
    onAdd(data, error);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        className="flex-1 p-2 rounded bg-slate-700 text-white"
        placeholder="New instrument"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
