// frontend/app/contact/page.tsx
export default function Contact() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0036] to-[#0f0c29] text-white p-8 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold mb-6 text-[#7f5af0]">Contact</h2>
      <form className="bg-[#18122B] p-8 rounded-xl border border-[#7f5af0] w-full max-w-md">
        <input type="text" placeholder="Name" className="w-full mb-4 p-3 rounded bg-[#232946] text-white border border-[#7f5af0] focus:outline-none" />
        <input type="email" placeholder="Email" className="w-full mb-4 p-3 rounded bg-[#232946] text-white border border-[#7f5af0] focus:outline-none" />
        <textarea placeholder="Message" className="w-full mb-4 p-3 rounded bg-[#232946] text-white border border-[#7f5af0] focus:outline-none" rows={4} />
        <button type="submit" className="w-full py-3 rounded bg-gradient-to-r from-[#7f5af0] to-[#6246ea] text-white font-bold hover:opacity-90 transition">Send</button>
      </form>
    </main>
  );
}
