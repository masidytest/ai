// frontend/app/docs/page.tsx
export default function Docs() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0036] to-[#0f0c29] text-white p-8 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold mb-6 text-[#7f5af0]">Docs</h2>
      <a href="/DOCS.md" className="text-[#7f5af0] underline">View full documentation</a>
    </main>
  );
}
