// frontend/components/billing/AiOnboardingAssistantPanel.tsx
import { useState } from 'react';

const mockSuggest = (prompt: string) => {
  if (prompt.includes('enterprise')) return 'enterprise';
  if (prompt.includes('pro')) return 'pro';
  return 'free';
};

export default function AiOnboardingAssistantPanel({ onSuggest }: { onSuggest?: (plan: string) => void }) {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSuggest = () => {
    const plan = mockSuggest(input);
    setResponse(`Suggested plan: ${plan}`);
    onSuggest?.(plan);
  };
  const handleExplainBilling = () => setResponse('Billing is based on your selected plan and usage.');
  const handleExplainUsage = () => setResponse('Usage limits depend on your plan. Free has basic limits, Pro and Enterprise offer more.');
  const handleGuideSetup = () => setResponse('To get started, choose a plan, add a payment method, and explore your dashboard.');

  return (
    <div className="bg-[#18122B] border border-[#7f5af0] rounded-xl p-6 mb-8">
      <div className="mb-2 text-[#7f5af0] font-bold">AI Onboarding Assistant</div>
      <textarea className="w-full p-2 rounded bg-[#232946] text-white mb-2" rows={2} value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about plans, billing, or setup..." />
      <div className="flex gap-2 mb-2">
        <button onClick={handleSuggest} className="bg-gradient-to-r from-[#7f5af0] to-[#6246ea] px-3 py-1 rounded text-white font-bold">Suggest Plan</button>
        <button onClick={handleExplainBilling} className="bg-[#232946] border border-[#7f5af0] px-3 py-1 rounded text-[#7f5af0] font-bold">Explain Billing</button>
        <button onClick={handleExplainUsage} className="bg-[#232946] border border-[#7f5af0] px-3 py-1 rounded text-[#7f5af0] font-bold">Usage Limits</button>
        <button onClick={handleGuideSetup} className="bg-[#232946] border border-[#7f5af0] px-3 py-1 rounded text-[#7f5af0] font-bold">Guide Setup</button>
      </div>
      {response && <div className="bg-[#232946] rounded p-2 text-[#a6a6d6]">{response}</div>}
    </div>
  );
}
