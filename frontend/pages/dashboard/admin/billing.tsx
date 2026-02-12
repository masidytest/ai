// frontend/pages/dashboard/admin/billing.tsx
const mockUsers = [
  { id: '1', name: 'Jane Doe', plan: 'pro', invoices: 2, payment: '**** 4242' },
  { id: '2', name: 'John Smith', plan: 'free', invoices: 0, payment: '' },
];

export default function AdminBillingDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0036] to-[#0f0c29] p-8 text-white">
      <div className="max-w-4xl mx-auto bg-[#18122B] rounded-xl shadow-lg p-8 border border-[#7f5af0]">
        <h2 className="text-2xl font-bold mb-6 text-[#7f5af0]">Admin Billing Dashboard</h2>
        <table className="w-full text-left bg-[#232946] rounded mb-8">
          <thead>
            <tr className="text-[#7f5af0]">
              <th className="p-2">User</th>
              <th className="p-2">Plan</th>
              <th className="p-2">Invoices</th>
              <th className="p-2">Payment</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map(u => (
              <tr key={u.id}>
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.plan}</td>
                <td className="p-2">{u.invoices}</td>
                <td className="p-2">{u.payment || <span className="text-[#a6a6d6]">None</span>}</td>
                <td className="p-2 flex gap-2">
                  <button className="bg-[#7f5af0] px-3 py-1 rounded text-white font-bold">Change Plan</button>
                  <button className="bg-red-600 px-3 py-1 rounded text-white font-bold">Revoke</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
