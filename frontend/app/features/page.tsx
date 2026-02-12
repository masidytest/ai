// frontend/app/features/page.tsx
export default function Features() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0036] to-[#0f0c29] text-white p-8">
      <h2 className="text-4xl font-bold mb-6 text-[#7f5af0]">Features</h2>
      <ul className="space-y-4">
        <li className="bg-[#18122B] p-4 rounded-xl border border-[#7f5af0]">AI Code, UI, and Workflow Generation</li>
        <li className="bg-[#18122B] p-4 rounded-xl border border-[#7f5af0]">Modular Engines: Auth, Billing, Projects, etc.</li>
        <li className="bg-[#18122B] p-4 rounded-xl border border-[#7f5af0]">Cloud, Hosting, Domains, Database</li>
        <li className="bg-[#18122B] p-4 rounded-xl border border-[#7f5af0]">Beautiful Neon/Dark UI</li>
        <li className="bg-[#18122B] p-4 rounded-xl border border-[#7f5af0]">Integrations, Templates, Logs, Deployments</li>
      </ul>
    </main>
  );
}
