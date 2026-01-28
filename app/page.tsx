"use client";

import { useState, useEffect } from "react";
import { supabaseClient } from "../lib/supabase/client";
import AddInstrumentForm from "../components/AddInstrumentForm";
import useSWR from "swr";

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
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("instruments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "instruments" },
        () => mutate(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mutate]);

  if (error) return <p className="text-red-500">{error.message}</p>;
  if (!instruments) return <p>Loading...</p>;

  const handleAdd = (
    instrument: { id: number; name: string } | null,
    error?: any,
  ) => {
    if (error) showMessage("Failed to add instrument", "error");
    else if (instrument)
      showMessage(`"${instrument.name}" added successfully!`);
  };

  const handleEdit = async (id: number) => {
    const { error } = await supabase
      .from("instruments")
      .update({ name: editName })
      .eq("id", id);
    if (error) showMessage(`Failed to update "${editName}"`, "error");
    else {
      setEditingId(null);
      mutate();
      showMessage(`"${editName}" updated successfully!`);
    }
  };

  const handleDelete = async (id: number) => {
    const instrument = instruments.find((i) => i.id === id);
    setDeletingId(id);

    setTimeout(async () => {
      const { error } = await supabase
        .from("instruments")
        .delete()
        .eq("id", id);
      if (error) showMessage(`Failed to delete "${instrument?.name}"`, "error");
      else showMessage(`"${instrument?.name}" deleted successfully!`);

      setDeletingId(null);
      mutate();
    }, 400); // match CSS animation
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🎻 Instruments</h1>

        {message && (
          <div
            className={`mb-4 p-3 rounded shadow ${
              message.type === "success" ? "bg-green-600" : "bg-red-600"
            } text-white`}
          >
            {message.text}
          </div>
        )}

        <AddInstrumentForm mutate={mutate} onAdd={handleAdd} />

        <ul className="space-y-3">
          {instruments.map((instrument) => (
            <li
              key={instrument.id}
              className={`bg-slate-800 rounded-lg p-4 shadow flex justify-between items-center ${
                deletingId === instrument.id ? "fade-out" : ""
              }`}
            >
              {editingId === instrument.id ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 p-2 rounded bg-slate-700 text-white mr-2"
                  />
                  <button
                    className="px-3 py-1 bg-green-600 rounded hover:bg-green-500 mr-2"
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
                </>
              ) : (
                <div className="flex gap-2">
                  <span className="flex-1">{instrument.name}</span>
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
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
