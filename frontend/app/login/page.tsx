// frontend/app/login/page.tsx
export default function Login() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0036] to-[#0f0c29] text-white flex flex-col items-center justify-center">
      <form className="bg-[#18122B] p-8 rounded-xl shadow-lg w-full max-w-md border border-[#7f5af0]">
        <h2 className="text-2xl font-bold mb-6 text-[#7f5af0]">Login</h2>
        <input type="email" placeholder="Email" className="w-full mb-4 p-3 rounded bg-[#232946] text-white border border-[#7f5af0] focus:outline-none" />
        <input type="password" placeholder="Password" className="w-full mb-4 p-3 rounded bg-[#232946] text-white border border-[#7f5af0] focus:outline-none" />
        <button type="submit" className="w-full py-3 rounded bg-gradient-to-r from-[#7f5af0] to-[#6246ea] text-white font-bold hover:opacity-90 transition">Login</button>
      </form>
    </main>
  );
}
