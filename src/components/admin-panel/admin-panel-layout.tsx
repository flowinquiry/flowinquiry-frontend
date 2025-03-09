"use client";

import { Footer } from "@/components/admin-panel/footer";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div
        className={cn(
          "flex flex-col w-full h-full transition-[margin-left] ease-in-out duration-300",
          !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72"),
        )}
      >
        <main className="flex-1 relative bg-zinc-50 dark:bg-zinc-900">
          <div className="absolute inset-0 overflow-y-auto">
            <div className="min-w-0 w-full">{children}</div>
          </div>
        </main>

        <footer className="shrink-0">
          <Footer />
        </footer>
      </div>
    </div>
  );
}
