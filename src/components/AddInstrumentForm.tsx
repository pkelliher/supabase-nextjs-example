"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";

const supabase = supabaseClient();

interface AddInstrumentFormProps {
  mutate: () => void;
  onAdd?: (
    instrument: { id: number; name: string } | null,
    error?: any,
  ) => void;
}

export default function AddInstrumentForm({
  mutate,
  onAdd,
}: AddInstrumentFormProps) {
  const [newInstrument, setNewInstrument] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("instruments")
      .insert([{ name: newInstrument }])
      .select();

    if (error) {
      console.error("Error adding instrument:", error);
      onAdd?.(null, error);
      return;
    }

    if (data && data[0]) {
      mutate(); // refresh SWR
      onAdd?.(data[0]);
      setNewInstrument("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex mb-4 gap-2">
      <input
        type="text"
        value={newInstrument}
        onChange={(e) => setNewInstrument(e.target.value)}
        placeholder="Add a new instrument"
        className="flex-1 p-2 rounded bg-slate-700 text-white"
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
      >
        Add
      </button>
    </form>
  );
}
