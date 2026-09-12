"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only read theme after mount
  useEffect(() => setMounted(true), []);

  // Close the menu whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close with Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const isDark = mounted && theme === "dark";
  const toggleLabel = mounted
    ? `Switch to ${isDark ? "light" : "dark"} mode`
    : "Toggle theme";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 sm:py-4 lg:px-10">
        {/* Row 1: name — and nav/theme on desktop */}
        <div className="flex items-center justify-between">
          <Link href="/" className="group text-lg font-bold tracking-tight">
            <span className="relative">
              Carlson
              <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </span>
          </Link>

          {/* Desktop nav + theme toggle (unchanged) */}
          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    "link-underline py-1 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-primary bg-[length:100%_2px]"
                      : "text-text-muted hover:text-text"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary/40 hover:bg-surface-alt"
                aria-label={toggleLabel}
              >
                {mounted ? (
                  isDark ? (
                    <Sun size={15} className="text-amber-400" />
                  ) : (
                    <Moon size={15} className="text-primary" />
                  )
                ) : (
                  <div className="h-4 w-4" />
                )}
              </button>
            </li>
          </ul>

          {/* Mobile theme toggle (right side, as before) */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary/40 hover:bg-surface-alt md:hidden"
            aria-label={toggleLabel}
          >
            {mounted ? (
              isDark ? (
                <Sun size={15} className="text-amber-400" />
              ) : (
                <Moon size={15} className="text-primary" />
              )
            ) : (
              <div className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Row 2 (mobile only): menu button on the LEFT, under the name */}
        <div className="mt-2 flex md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary/40 hover:bg-surface-alt"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown — original expandable menu, left-aligned */}
      <div
        id="mobile-nav"
        className={clsx(
          "overflow-hidden transition-all duration-300 ease-in-out md:hidden",
          mobileOpen ? "max-h-80 border-t border-border" : "max-h-0"
        )}
      >
        <ul className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 lg:px-10">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMobileOpen(false)}
                aria-current={pathname === link.href ? "page" : undefined}
                className={clsx(
                  "block py-2.5 text-[15px] font-medium transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-text-muted"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
