"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, ListChecks, MessagesSquare, Sparkle, UserRound } from "lucide-react";
import { AccessibilityPanel } from "@/components/accessibility-panel";
import { cn } from "@/lib/utils";

const links = [
  { href: "/perfil", label: "Perfil", icon: UserRound },
  { href: "/plan", label: "Mi plan", icon: ListChecks },
  { href: "/vacantes", label: "Vacantes", icon: BriefcaseBusiness },
  { href: "/entrevista", label: "Entrevista", icon: MessagesSquare },
];

export function SiteNav() {
  const pathname = usePathname();

  const items = links.map(({ href, label, icon: Icon }) => {
    const active = pathname.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex flex-1 flex-col items-center gap-1 whitespace-nowrap rounded-lg px-1 py-2 text-xs md:flex-none md:flex-row md:gap-2 md:px-3 md:text-sm",
          active ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Icon className="size-5" aria-hidden />
        {label}
      </Link>
    );
  });

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <Sparkle className="size-5 fill-star text-star" aria-hidden />
            Constela
          </Link>
          <nav aria-label="Principal" className="hidden gap-1 md:flex">
            {items}
          </nav>
          <AccessibilityPanel />
        </div>
      </header>
      {/* En celular la navegación va abajo, al alcance del pulgar */}
      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-10 flex border-t bg-background px-2 pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {items}
      </nav>
    </>
  );
}
