import { DashboardLayout } from "../../components/DashboardLayout";
import { TopNavbar } from "../../components/TopNavbar";
import { BuildIndicator } from "../../components/BuildIndicator";

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <TopNavbar />
        <div className="flex-1 min-h-0">
          {children}
        </div>
      </div>
      <BuildIndicator />
    </DashboardLayout>
  );
}
