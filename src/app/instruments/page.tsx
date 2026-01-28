import { supabaseClient } from "@/lib/supabase/client";
import AddInstrumentForm from "@/components/AddInstrumentForm";

export default async function InstrumentsPage() {
  const supabase = supabaseClient();

  const { data: instruments, error } = await supabase
    .from("instruments")
    .select()
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-red-500">{error.message}</p>;
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🎻 Instruments</h1>
        <AddInstrumentForm />
        <ul className="space-y-3">
          {instruments?.map((instrument) => (
            <li
              key={instrument.id}
              className="bg-slate-800 rounded-lg p-4 shadow"
            >
              {instrument.name}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
