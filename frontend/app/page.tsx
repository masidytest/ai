// frontend/app/page.tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0036] to-[#0f0c29] text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4 text-[#7f5af0]">Masidy Platform</h1>
      <p className="text-xl mb-8 text-[#a6a6d6]">The modular, AI-powered SaaS platform for the future.</p>
      <a href="/features" className="bg-gradient-to-r from-[#7f5af0] to-[#6246ea] px-6 py-3 rounded text-white font-bold hover:opacity-90 transition">Explore Features</a>
    </main>
  );
}
