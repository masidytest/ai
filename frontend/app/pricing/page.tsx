// frontend/app/pricing/page.tsx
export default function Pricing() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0036] to-[#0f0c29] text-white p-8">
      <h2 className="text-4xl font-bold mb-6 text-[#7f5af0]">Pricing</h2>
      <div className="bg-[#18122B] p-6 rounded-xl border border-[#7f5af0] mb-4">
        <div className="font-bold text-2xl mb-2">Free</div>
        <div className="mb-2">$0/month</div>
        <div>Basic features, community support</div>
      </div>
      <div className="bg-[#18122B] p-6 rounded-xl border border-[#7f5af0] mb-4">
        <div className="font-bold text-2xl mb-2">Pro</div>
        <div className="mb-2">$20/month</div>
        <div>All features, priority support, advanced AI</div>
      </div>
      <div className="bg-[#18122B] p-6 rounded-xl border border-[#7f5af0]">
        <div className="font-bold text-2xl mb-2">Enterprise</div>
        <div className="mb-2">Custom</div>
        <div>Dedicated support, custom integrations</div>
      </div>
    </main>
  );
}
