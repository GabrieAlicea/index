import Link from "next/link";

import { Logo } from "@/components/shared/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-grid relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="bg-radial-fade pointer-events-none absolute inset-0" aria-hidden="true" />
      <Link href="/" className="relative mb-8">
        <Logo />
      </Link>
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}
