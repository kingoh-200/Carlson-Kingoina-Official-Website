"use client";

import { Github, Instagram, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";

const socials = [
  { href: "https://github.com/kingoh-200", label: "GitHub", icon: Github },
  { href: "https://www.linkedin.com/in/carison-moikoro-56b198303", label: "LinkedIn", icon: Linkedin },
  { href: "https://x.com/carlson15564064", label: "X (Twitter)", icon: Twitter },
  { href: "https://www.instagram.com/mmh.key.sea/", label: "Instagram", icon: Instagram },
  { href: "https://wa.me/254706504939", label: "WhatsApp", icon: WhatsAppIcon },
];

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 448 512" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32 101.5 32 1.9 131.6 1.9 254c0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-156.9zM223.9 438.7c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.6-138c-5.6-2.8-33.2-16.4-38.3-18.3-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.4 18.3-17.7 22-3.2 3.7-6.5 4.2-12.1 1.4-33.1-16.6-54.9-29.6-76.8-67.2-5.8-10 5.8-9.3 16.6-31 1.9-3.7 1-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.7 23.5 9.1 31.5 11.6 13.2 4.2 25.2 3.6 34.7 2.2 10.6-1.6 33.2-13.6 37.9-26.8 4.7-13.2 4.7-24.5 3.3-26.8-1.4-2.5-5.1-3.9-10.6-6.7z" />
    </svg>
  );
}

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
