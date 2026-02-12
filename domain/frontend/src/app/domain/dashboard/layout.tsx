import DashboardSidebarLayout from "../../../src/app/dashboard/sidebar-layout";
import DomainDashboard from "../../frontend/src/app/domain/dashboard/page";

export default function DomainDashboardLayoutPage() {
  return (
    <DashboardSidebarLayout>
      <DomainDashboard />
    </DashboardSidebarLayout>
  );
}
