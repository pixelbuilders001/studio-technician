"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, User, Briefcase, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";

const navItems = [
  { href: "/jobs", icon: Briefcase, labelKey: "jobs" },
  // { href: "/notifications", icon: Bell, labelKey: "notifications" },
  { href: "/profile", icon: User, labelKey: "profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2">
      <nav className="relative flex h-16 items-center justify-around rounded-2xl border border-white/20 bg-white/80 px-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors duration-300"
            >
              <div className={cn(
                "relative z-10 flex flex-col items-center justify-center gap-1 transition-all duration-300",
                isActive ? "scale-110" : "scale-100 opacity-60"
              )}>
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300",
                  isActive ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-slate-600"
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  isActive ? "text-primary" : "text-slate-500"
                )}>
                  {t(`bottom_nav.${item.labelKey}`) || item.labelKey}
                </span>
              </div>

              {isActive && (
                <motion.div
                  layoutId="nav-glow"
                  className="absolute inset-x-2 bottom-1 h-1 rounded-full bg-primary/20 blur-sm"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
