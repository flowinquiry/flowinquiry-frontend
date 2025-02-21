import { TimeRangeProvider } from "@/providers/time-range-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TimeRangeProvider>
      <div className="dashboard-container">{children}</div>
    </TimeRangeProvider>
  );
}
