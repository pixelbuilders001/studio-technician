"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

const navItems = [
  { href: "/jobs", icon: Wrench, labelKey: "jobs" },
  { href: "/profile", icon: User, labelKey: "profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 h-16 w-full max-w-md -translate-x-1/2 border-t bg-background">
      <div className="grid h-full grid-cols-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-sm font-medium",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span>{t(`bottom_nav.${item.labelKey}`)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
