import DashboardSidebarLayout from "../../../src/app/dashboard/sidebar-layout";
import DomainDetailPage from "../../frontend/src/app/domain/[name]/page";

export default function DomainDetailLayoutPage({ params }: { params: { name: string } }) {
  return (
    <DashboardSidebarLayout>
      <DomainDetailPage params={params} />
    </DashboardSidebarLayout>
  );
}
