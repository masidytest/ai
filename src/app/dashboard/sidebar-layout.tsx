import { Sidebar } from "../../components/Sidebar";

export default function DashboardSidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-app-bg">
        {children}
      </div>
    </div>
  );
}
