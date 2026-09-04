"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
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

  const isDark = mounted && theme === "dark";
  const toggleLabel = mounted
    ? `Switch to ${isDark ? "light" : "dark"} mode`
    : "Toggle theme";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="group text-lg font-bold tracking-tight"
        >
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
                    ? "text-primary !bg-[length:100%_2px]"
                    : "text-text-muted hover:text-text"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {/* Theme toggle — desktop */}
          <li>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-all hover:border-primary/40 hover:bg-surface-alt"
              aria-label={toggleLabel}
            >
              {mounted ? (
                isDark ? (
                  <Sun size={15} className="text-amber-400 transition-transform hover:rotate-45" />
                ) : (
                  <Moon size={15} className="text-primary transition-transform hover:-rotate-12" />
                )
              ) : (
                <div className="h-4 w-4" />
              )}
            </button>
          </li>
        </ul>

        {/* Mobile right side */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-all hover:border-primary/40"
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
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      <div
        className={clsx(
          "overflow-hidden transition-all duration-300 ease-in-out md:hidden",
          mobileOpen ? "max-h-80 border-t border-border" : "max-h-0"
        )}
      >
        <ul className="px-6 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "block py-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href
                    ? "text-primary"
                    : "text-text-muted"
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
