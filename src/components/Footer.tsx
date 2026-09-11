"use client";

import { Github, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";

const socials = [
  { href: "https://github.com/kingoh-200", label: "GitHub", icon: Github },
  { href: "https://www.linkedin.com/in/carison-moikoro-56b198303", label: "LinkedIn", icon: Linkedin },
  { href: "https://x.com/carlson15564064", label: "X (Twitter)", icon: Twitter },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface-alt">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:px-6 sm:justify-between lg:px-10">
        <p className="text-sm text-text-muted">
          © {new Date().getFullYear()} Carlson Kingoina. All rights reserved.
        </p>
        <ul className="flex gap-4">
          {socials.map((s) => (
            <li key={s.label}>
              <motion.a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted transition-colors hover:text-primary"
                aria-label={s.label}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <s.icon size={18} />
              </motion.a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
