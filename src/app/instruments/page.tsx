import AddInstrumentForm from "@/components/AddInstrumentForm";
import { supabaseClient } from "@/lib/supabase/client";

export default async function InstrumentsPage() {
  const supabase = supabaseClient();

  // Server-side fetch for initial load
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

        {/* Pass initial instruments to the client component */}
        <AddInstrumentForm initialInstruments={instruments || []} />
      </div>
    </main>
  );
}
