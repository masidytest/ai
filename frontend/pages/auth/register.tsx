// frontend/pages/auth/register.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Stub: Simulate registration
    if (email && password) {
      router.push('/auth/login');
    } else {
      setError('Please fill all fields');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0036] to-[#0f0c29]">
      <form onSubmit={handleSubmit} className="bg-[#18122B] p-8 rounded-xl shadow-lg w-full max-w-md border border-[#7f5af0]">
        <h2 className="text-2xl font-bold mb-6 text-[#7f5af0]">Register</h2>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mb-4 p-3 rounded bg-[#232946] text-white border border-[#7f5af0] focus:outline-none" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mb-4 p-3 rounded bg-[#232946] text-white border border-[#7f5af0] focus:outline-none" />
        {error && <div className="text-red-400 mb-4">{error}</div>}
        <button type="submit" className="w-full py-3 rounded bg-gradient-to-r from-[#7f5af0] to-[#6246ea] text-white font-bold hover:opacity-90 transition">Register</button>
      </form>
    </div>
  );
}
