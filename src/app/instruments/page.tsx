"use client";

import { supabaseClient } from "@/lib/supabase/client";
import AddInstrumentForm from "@/components/AddInstrumentForm";
import useSWR from "swr";
import { useState } from "react";

const supabase = supabaseClient();

const fetcher = async () => {
  const { data, error } = await supabase
    .from("instruments")
    .select()
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export default function InstrumentsPage() {
  const { data: instruments, error, mutate } = useSWR("instruments", fetcher);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  if (error) return <p className="text-red-500">{error.message}</p>;
  if (!instruments) return <p>Loading...</p>;

  const handleEdit = async (id: number) => {
    const { error } = await supabase
      .from("instruments")
      .update({ name: editName })
      .eq("id", id);

    if (error) {
      console.error("Error updating instrument:", error);
    } else {
      setEditingId(null);
      mutate(); // revalidate SWR
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("instruments").delete().eq("id", id);

    if (error) {
      console.error("Error deleting instrument:", error);
    } else {
      mutate(); // Refresh the list after deletion
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🎻 Instruments</h1>
        <AddInstrumentForm mutate={mutate} />
        <ul className="space-y-3">
          {instruments.map((instrument) => (
            <li
              key={instrument.id}
              className="bg-slate-800 rounded-lg p-4 shadow flex items-center justify-between"
            >
              {editingId === instrument.id ? (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 p-2 rounded bg-slate-700 text-white"
                  />
                  <button
                    className="px-3 py-1 bg-green-600 rounded hover:bg-green-500"
                    onClick={() => handleEdit(instrument.id)}
                  >
                    Save
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 rounded hover:bg-red-500"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-between">
                  <span className="flex-1">{instrument.name}</span>
                  <div className="flex gap-2 ml-4">
                    <button
                      className="px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-500"
                      onClick={() => {
                        setEditingId(instrument.id);
                        setEditName(instrument.name);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 rounded hover:bg-red-500"
                      onClick={() => handleDelete(instrument.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
