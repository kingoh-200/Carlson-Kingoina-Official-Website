"use client";

import dynamic from "next/dynamic";
import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import AnimatedSection from "@/components/AnimatedSection";
import LikeButton from "@/components/LikeButton";
import SubscribeForm from "@/components/SubscribeForm";
import { skills, projects } from "@/lib/data";
import { Code, Server, Wrench, ArrowRight, Images } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight as faArrowRightSolid } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

// Lazy-load the heavy canvas hero
const InteractiveHero = dynamic(() => import("@/components/InteractiveHero"), {
  ssr: false,
  loading: () => (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">Hello, I&apos;m</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">Carlson Kingoina</h1>
      </div>
    </section>
  ),
});

export default function Home() {
  return (
    <>
      <InteractiveHero />

      {/* ── Featured Projects ── */}
      <AnimatedSection>
        <Section title="Featured Projects" description="Some things I've built recently.">
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.slice(0, 2).map((project, i) => (
              <AnimatedSection key={project.title} delay={i * 0.1}>
                <ProjectCard project={project} />
              </AnimatedSection>
            ))}
          </div>
          <Link
            href="/projects"
            className="link-underline mt-6 inline-flex items-center gap-1.5 py-1 text-sm font-medium text-primary"
          >
            View all projects <FontAwesomeIcon icon={faArrowRightSolid} className="h-3 w-3" />
          </Link>
        </Section>
      </AnimatedSection>

      {/* ── Skills ── */}
      <AnimatedSection delay={0.1}>
        <Section
          title="Skills"
          description="Technologies and tools I work with."
          className="bg-surface-alt"
        >
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: <Code size={20} />, title: "Frontend", items: skills.frontend },
              { icon: <Server size={20} />, title: "Backend", items: skills.backend },
              { icon: <Wrench size={20} />, title: "Tools", items: skills.tools },
            ].map((skill, i) => (
              <AnimatedSection key={skill.title} delay={i * 0.08}>
                <SkillItem {...skill} />
              </AnimatedSection>
            ))}
          </div>
        </Section>
      </AnimatedSection>

      {/* ── Gallery teaser ── */}
      <AnimatedSection delay={0.12}>
        <div className="px-6 py-12">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/gallery"
              className="group flex items-center gap-4 rounded-2xl border border-border p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Images size={22} />
              </div>
              <div>
                <h3 className="font-semibold">Gallery</h3>
                <p className="text-sm text-text-muted">
                  Photos from projects, campus, and life.
                </p>
              </div>
              <ArrowRight size={18} className="ml-auto text-text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Subscribe + Like ── */}
      <AnimatedSection delay={0.15}>
        <div className="px-6 py-12">
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">
            <SubscribeForm />
            <div className="flex flex-col items-start justify-center gap-6">
              <div>
                <h3 className="font-semibold">Enjoying the site?</h3>
                <p className="mt-1 text-sm text-text-muted">
                  Show some love — it means a lot.
                </p>
              </div>
              <LikeButton page="home" />
            </div>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}

function SkillItem({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="glow-card group rounded-xl border border-border p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="text-primary transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm text-text-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
