// frontend/pages/auth/logout.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    // Stub: Simulate logout
    router.push('/auth/login');
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0036] to-[#0f0c29] text-[#7f5af0]">
      Logging out...
    </div>
  );
}
