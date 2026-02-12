// frontend/pages/dashboard/account.tsx
import { useState } from 'react';

const mockUser = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  avatar: '',
};

const mockApiKeys = [
  { id: '1', key: 'sk-xxxxxx', revoked: false },
  { id: '2', key: 'sk-yyyyyy', revoked: true },
];

export default function AccountPage() {
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [newKey, setNewKey] = useState('');

  const handleCreateKey = () => {
    setApiKeys([...apiKeys, { id: Date.now().toString(), key: 'sk-' + Math.random().toString(36).slice(2), revoked: false }]);
  };
  const handleRevoke = (id: string) => {
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, revoked: true } : k));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0036] to-[#0f0c29] p-8 text-white">
      <div className="max-w-2xl mx-auto bg-[#18122B] rounded-xl shadow-lg p-8 border border-[#7f5af0]">
        <h2 className="text-2xl font-bold mb-6 text-[#7f5af0]">Account Settings</h2>
        {/* Profile */}
        <div className="mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#232946] flex items-center justify-center text-3xl">
            {mockUser.avatar || mockUser.name[0]}
          </div>
          <div>
            <div className="font-semibold">{mockUser.name}</div>
            <div className="text-[#a6a6d6]">{mockUser.email}</div>
          </div>
        </div>
        {/* Email */}
        <div className="mb-6">
          <label className="block mb-1 text-[#7f5af0]">Email</label>
          <input className="w-full p-3 rounded bg-[#232946] border border-[#7f5af0] text-white" value={mockUser.email} readOnly />
        </div>
        {/* Password change (stub) */}
        <div className="mb-6">
          <label className="block mb-1 text-[#7f5af0]">Change Password</label>
          <input className="w-full p-3 rounded bg-[#232946] border border-[#7f5af0] text-white mb-2" type="password" placeholder="New password (stub)" readOnly />
          <button className="bg-[#7f5af0] px-4 py-2 rounded text-white opacity-60 cursor-not-allowed">Change (stub)</button>
        </div>
        {/* API Keys Manager */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[#7f5af0]">API Keys</label>
            <button onClick={handleCreateKey} className="bg-gradient-to-r from-[#7f5af0] to-[#6246ea] px-4 py-2 rounded text-white font-bold">Create Key</button>
          </div>
          <ul>
            {apiKeys.map(k => (
              <li key={k.id} className="flex items-center justify-between bg-[#232946] rounded p-2 mb-2 border border-[#7f5af0]">
                <span className={k.revoked ? 'line-through text-[#a6a6d6]' : ''}>{k.key}</span>
                {!k.revoked && <button onClick={() => handleRevoke(k.id)} className="text-red-400 ml-4">Revoke</button>}
                {k.revoked && <span className="ml-4 text-[#a6a6d6]">Revoked</span>}
              </li>
            ))}
          </ul>
        </div>
        {/* Danger zone */}
        <div className="mt-8">
          <div className="font-bold text-red-400 mb-2">Danger Zone</div>
          <button className="bg-red-600 px-4 py-2 rounded text-white font-bold hover:bg-red-700 transition">Delete Account</button>
        </div>
      </div>
    </div>
  );
}
