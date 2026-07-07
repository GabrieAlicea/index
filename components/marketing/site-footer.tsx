import Link from "next/link";

import { Logo } from "@/components/shared/logo";

function SocialIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d={path} />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    path: "M12 2.2c3.2 0 3.6 0 4.9.07 3.3.15 4.8 1.7 5 5 .06 1.3.07 1.6.07 4.8s0 3.6-.07 4.9c-.15 3.3-1.7 4.8-5 5-1.3.06-1.6.07-4.9.07s-3.6 0-4.9-.07c-3.3-.15-4.8-1.7-5-5C2.03 15.6 2 15.3 2 12s0-3.6.07-4.9c.15-3.3 1.7-4.8 5-5C8.4 2.03 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.52 0-4.76.07-2.5.11-3.66 1.29-3.77 3.77C3.4 8.98 3.4 9.28 3.4 12s0 3.02.07 4.16c.11 2.48 1.27 3.66 3.77 3.77C8.48 20 8.85 20 12 20s3.52 0 4.76-.07c2.5-.11 3.66-1.27 3.77-3.77.07-1.14.07-1.44.07-4.16s0-3.02-.07-4.16c-.11-2.48-1.28-3.66-3.77-3.77A66 66 0 0 0 12 4Zm0 3.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Zm0 1.8a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Zm4.8-2.9a1.08 1.08 0 1 1 0 2.15 1.08 1.08 0 0 1 0-2.15Z",
  },
  {
    label: "X",
    path: "M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.7L4.5 22H1.4l8.1-9.3L1 2h7l4.9 6.1L18.9 2Zm-1.2 18h1.7L6.4 4H4.6l13.1 16Z",
  },
  {
    label: "Facebook",
    path: "M13.5 21v-7.9h2.7l.4-3.1h-3.1V8.1c0-.9.25-1.5 1.55-1.5H16.7V3.8c-.28-.04-1.25-.12-2.38-.12-2.35 0-3.96 1.43-3.96 4.07V10H7.6v3.1h2.76V21h3.14Z",
  },
  {
    label: "YouTube",
    path: "M22.5 7.2a2.9 2.9 0 0 0-2-2.05C18.7 4.7 12 4.7 12 4.7s-6.7 0-8.5.45a2.9 2.9 0 0 0-2 2.05A30.6 30.6 0 0 0 1 12a30.6 30.6 0 0 0 .5 4.8 2.9 2.9 0 0 0 2 2.05c1.8.45 8.5.45 8.5.45s6.7 0 8.5-.45a2.9 2.9 0 0 0 2-2.05A30.6 30.6 0 0 0 23 12a30.6 30.6 0 0 0-.5-4.8ZM9.8 15.3V8.7l5.7 3.3-5.7 3.3Z",
  },
];

const FOOTER_LINKS: Record<string, { label: string; href: string }[]> = {
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Services: [
    { label: "All Services", href: "/services" },
    { label: "Roadside Assistance", href: "/roadside-assistance" },
    { label: "For Fleets", href: "/fleets" },
    { label: "Pricing", href: "/pricing" },
  ],
  Mechanics: [
    { label: "Become a Mechanic", href: "/become-a-mechanic" },
    { label: "How it Works", href: "/how-it-works" },
    { label: "Mechanic Login", href: "/login" },
  ],
  Support: [
    { label: "Help Center", href: "/support" },
    { label: "FAQ", href: "/faq" },
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Privacy Policy", href: "/legal/privacy" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-base-raised">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-text-muted">
              Mechanics that come to you. Vetted, insured, on-demand auto repair — anywhere in Florida.
            </p>
            <div className="mt-6 flex items-center gap-3 text-text-muted">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="transition-colors hover:text-text"
                >
                  <SocialIcon path={social.path} />
                </Link>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-faint">
                {section}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted transition-colors hover:text-text"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 sm:flex-row">
          <p className="text-xs text-text-faint">
            © {new Date().getFullYear()} Revvy, Inc. All rights reserved.
          </p>
          <p className="text-xs text-text-faint">Proudly built in Florida.</p>
        </div>
      </div>
    </footer>
  );
}
