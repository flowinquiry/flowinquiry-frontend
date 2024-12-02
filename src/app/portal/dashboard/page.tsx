import { ContentLayout } from "@/components/admin-panel/content-layout";
import RecentUserTeamActivities from "@/components/dashboard/global-dashboard-recent-activities";
import UserNotifications from "@/components/dashboard/notifications-user";
import TeamUnresolvedTicketsPriorityDistributionChart from "@/components/dashboard/team-unresolved-tickets-priority-distribution";

export default function Home() {
  return (
    <ContentLayout title="Dashboard">
      <h1 className="text-2xl mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <RecentUserTeamActivities />
        <UserNotifications />
        <TeamUnresolvedTicketsPriorityDistributionChart />
      </div>
    </ContentLayout>
  );
}
