import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/shell";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export default async function MechanicDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "mechanic" && user.role !== "admin") {
    redirect(`/dashboard/${user.role}`);
  }

  return (
    <DashboardShell role="mechanic" userName={user.full_name}>
      {children}
    </DashboardShell>
  );
}
