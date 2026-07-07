import Link from "next/link";
import { redirect } from "next/navigation";
import { X } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export default async function BookLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/book");

  return (
    <div className="min-h-screen bg-base">
      <header className="glass-strong sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/8 px-4 sm:px-6">
        <Link href="/">
          <Logo />
        </Link>
        <Link
          href="/dashboard/customer"
          aria-label="Close booking"
          className="rounded-full p-2 text-text-muted transition-colors hover:bg-white/5 hover:text-text"
        >
          <X className="size-5" />
        </Link>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
