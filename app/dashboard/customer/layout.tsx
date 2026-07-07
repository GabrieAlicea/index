import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/shell";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "customer" && user.role !== "admin") {
    redirect(`/dashboard/${user.role}`);
  }

  return (
    <DashboardShell role="customer" userName={user.full_name}>
      {children}
    </DashboardShell>
  );
}
