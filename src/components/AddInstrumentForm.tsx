"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";

type Instrument = {
  id: number;
  name: string;
  created_at: string;
};

export default function AddInstrumentForm({
  initialInstruments,
}: {
  initialInstruments: Instrument[];
}) {
  const [instruments, setInstruments] =
    useState<Instrument[]>(initialInstruments);
  const [newInstrument, setNewInstrument] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!newInstrument) return;

    setLoading(true);

    const supabase = supabaseClient();
    const { data, error } = await supabase
      .from("instruments")
      .insert([{ name: newInstrument }])
      .select(); // Return the inserted row

    if (error) {
      console.error("Error adding instrument:", error);
    } else if (data) {
      setInstruments([data[0], ...instruments]); // Prepend new instrument
      setNewInstrument(""); // Clear input
    }

    setLoading(false);
  };

  return (
    <div className="mb-6">
      <div className="flex space-x-2 mb-4">
        <input
          className="flex-1 p-2 rounded bg-slate-800 text-slate-100 border border-slate-700"
          placeholder="New instrument"
          value={newInstrument}
          onChange={(e) => setNewInstrument(e.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded"
          onClick={handleAdd}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Instrument"}
        </button>
      </div>

      <ul className="space-y-3">
        {instruments.map((instrument) => (
          <li
            key={instrument.id}
            className="bg-slate-800 rounded-lg p-4 shadow"
          >
            {instrument.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
