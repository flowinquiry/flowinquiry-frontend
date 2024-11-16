import { Navbar } from "@/components/admin-panel/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div className="h-full">
      <Navbar title={title} />
      <div className="container pt-8 pb-8 px-4 sm:px-8 bg-card">{children}</div>
    </div>
  );
}
