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

  // Close the mobile drawer on route change and lock page scroll while open
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const isDark = mounted && theme === "dark";
  const toggleLabel = mounted
    ? `Switch to ${isDark ? "light" : "dark"} mode`
    : "Toggle theme";

  const themeToggle = (
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
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="group text-lg font-bold tracking-tight">
          <span className="relative">
            Carlson
            <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
          </span>
        </Link>

        {/* Desktop nav */}
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
          <li>{themeToggle}</li>
        </ul>

        {/* Mobile right side */}
        <div className="flex items-center gap-2 md:hidden">
          {themeToggle}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary/40 hover:bg-surface-alt"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            <Menu size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer — slides in from the left */}
      <div
        id="mobile-nav"
        className={clsx(
          "fixed inset-0 z-[60] md:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileOpen(false)}
          className={clsx(
            "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Panel — anchored to the left edge */}
        <div
          className={clsx(
            "absolute inset-y-0 left-0 flex w-[min(19rem,85vw)] max-w-[85vw] flex-col border-r border-border bg-surface shadow-2xl transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <span className="text-base font-bold tracking-tight">Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary/40 hover:bg-surface-alt"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {navLinks.map((link, i) => (
                <li
                  key={link.href}
                  style={{ transitionDelay: mobileOpen ? `${i * 40}ms` : "0ms" }}
                  className={clsx(
                    "transition-all duration-300",
                    mobileOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-3 opacity-0"
                  )}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className={clsx(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors",
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-text-muted hover:bg-surface-alt hover:text-text"
                    )}
                  >
                    <span
                      className={clsx(
                        "h-1.5 w-1.5 rounded-full transition-colors",
                        pathname === link.href ? "bg-primary" : "bg-border"
                      )}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Drawer footer */}
          <div className="border-t border-border px-5 py-4 text-xs text-text-muted">
            © {new Date().getFullYear()} Carlson Kingoina
          </div>
        </div>
      </div>
    </header>
  );
}
