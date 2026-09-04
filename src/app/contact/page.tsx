"use client";

import Section from "@/components/Section";
import ContactForm from "@/components/ContactForm";
import AnimatedSection from "@/components/AnimatedSection";
import { Mail, Github, Twitter } from "lucide-react";
import { siteConfig } from "@/lib/data";

export default function ContactPage() {
  return (
    <Section title="Get in Touch" className="pt-24">
      <div className="grid gap-12 lg:grid-cols-5">
        <AnimatedSection className="lg:col-span-3">
          <ContactForm />
        </AnimatedSection>
        <AnimatedSection delay={0.15} className="lg:col-span-2">
          <aside className="space-y-6">
            <h3 className="font-semibold">Other ways to reach me</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-2 text-text-muted transition-colors hover:text-primary">
                <Mail size={16} className="text-primary" />
                {siteConfig.email}
              </li>
              <li className="flex items-center gap-2 text-text-muted transition-colors hover:text-primary">
                <Github size={16} className="text-primary" />
                <a
                  href={siteConfig.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline"
                >
                  github.com/kingoh-200
                </a>
              </li>
              <li className="flex items-center gap-2 text-text-muted transition-colors hover:text-primary">
                <Twitter size={16} className="text-primary" />
                <a
                  href={siteConfig.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline"
                >
                  @carlsonkingoina
                </a>
              </li>
            </ul>
          </aside>
        </AnimatedSection>
      </div>
    </Section>
  );
}
