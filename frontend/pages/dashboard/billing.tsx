// frontend/pages/dashboard/billing.tsx
import { useState } from 'react';

const mockPlans = [
  { id: 'free', name: 'Free', price: 0, features: ['Basic usage', 'Community support'] },
  { id: 'pro', name: 'Pro', price: 20, features: ['All Free features', 'Priority support', 'Advanced tools'] },
  { id: 'enterprise', name: 'Enterprise', price: 100, features: ['All Pro features', 'Dedicated manager', 'Custom integrations'] },
];
const mockInvoices = [
  { id: '1', amount: 20, createdAt: '2026-02-01', paid: true },
  { id: '2', amount: 20, createdAt: '2026-01-01', paid: true },
];

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState('pro');
  const [paymentMethod, setPaymentMethod] = useState('**** **** **** 4242');
  const [status, setStatus] = useState('active');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0036] to-[#0f0c29] p-8 text-white">
      <div className="max-w-2xl mx-auto bg-[#18122B] rounded-xl shadow-lg p-8 border border-[#7f5af0]">
        <h2 className="text-2xl font-bold mb-6 text-[#7f5af0]">Billing</h2>
        {/* Current Plan */}
        <div className="mb-6">
          <div className="font-semibold mb-1">Current Plan</div>
          <div className="mb-2">{mockPlans.find(p => p.id === currentPlan)?.name}</div>
          <div className="flex gap-2">
            {mockPlans.map(p => (
              <button key={p.id} onClick={() => setCurrentPlan(p.id)} className={`px-4 py-2 rounded font-bold ${currentPlan === p.id ? 'bg-[#7f5af0] text-white' : 'bg-[#232946] text-[#7f5af0] border border-[#7f5af0]'}`}>{p.name}</button>
            ))}
          </div>
        </div>
        {/* Payment Method */}
        <div className="mb-6">
          <div className="font-semibold mb-1">Payment Method</div>
          <input className="w-full p-3 rounded bg-[#232946] border border-[#7f5af0] text-white mb-2" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} />
          <button className="bg-gradient-to-r from-[#7f5af0] to-[#6246ea] px-4 py-2 rounded text-white font-bold">Update</button>
        </div>
        {/* Invoice History */}
        <div className="mb-6">
          <div className="font-semibold mb-1">Invoice History</div>
          <table className="w-full text-left bg-[#232946] rounded">
            <thead>
              <tr className="text-[#7f5af0]">
                <th className="p-2">Date</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map(inv => (
                <tr key={inv.id}>
                  <td className="p-2">{inv.createdAt}</td>
                  <td className="p-2">${inv.amount}</td>
                  <td className="p-2">{inv.paid ? 'Paid' : 'Unpaid'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Subscription Status */}
        <div className="mb-6">
          <div className="font-semibold mb-1">Subscription Status</div>
          <div className="mb-2">{status}</div>
          <button onClick={() => setStatus('canceled')} className="bg-red-600 px-4 py-2 rounded text-white font-bold hover:bg-red-700 transition">Cancel Subscription</button>
        </div>
      </div>
    </div>
  );
}
