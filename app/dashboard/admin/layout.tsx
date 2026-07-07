import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/shell";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin" && user.role !== "support_agent" && user.role !== "finance") {
    redirect(`/dashboard/${user.role}`);
  }

  return (
    <DashboardShell role="admin" userName={user.full_name}>
      {children}
    </DashboardShell>
  );
}
