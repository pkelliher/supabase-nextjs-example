"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";

const supabase = supabaseClient();

interface AddInstrumentFormProps {
  mutate: () => void;
}

export default function AddInstrumentForm({ mutate }: AddInstrumentFormProps) {
  const [newInstrument, setNewInstrument] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!newInstrument.trim()) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("instruments")
      .insert([{ name: newInstrument }])
      .select();

    if (error) {
      console.error("Error adding instrument:", error);
    } else {
      setNewInstrument("");
      mutate(); // revalidate SWR
    }

    setLoading(false);
  };

  return (
    <div className="mb-4 flex space-x-2">
      <input
        type="text"
        placeholder="Add an instrument"
        value={newInstrument}
        onChange={(e) => setNewInstrument(e.target.value)}
        className="flex-1 p-2 rounded bg-slate-700 text-white"
      />
      <button
        onClick={handleAdd}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </div>
  );
}
