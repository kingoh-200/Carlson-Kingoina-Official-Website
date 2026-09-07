"use client";

import { motion } from "framer-motion";
import Section from "@/components/Section";
import AnimatedSection from "@/components/AnimatedSection";
import SparkleEffect from "@/components/SparkleEffect";
import { SkillCard, InfoItem } from "@/components/InfoCards";
import { siteConfig, skills } from "@/lib/data";
import {
  Code,
  Server,
  Wrench,
  MapPin,
  Mail,
  Calendar,
  Heart,
  Sparkles,
  Rocket,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrophy,
  faFish,
  faBookOpen,
  faRocket,
  faHand,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      {/* ── Hero: Photo + Greeting ── */}
      <section className="px-6 pt-28 pb-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
            {/* Photo */}
            <AnimatedSection>
              <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-border bg-surface-alt shadow-lg sm:h-48 sm:w-48">
                <Image
                  src="/images/profile.jpg"
                  alt="Carlson Kingoina"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-text-muted">
                  CK
                </div>
              </div>
            </AnimatedSection>

            {/* Greeting */}
            <div className="flex-1">
              <AnimatedSection delay={0.05}>
                <p className="text-sm font-medium uppercase tracking-widest text-primary">
                  About
                </p>
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <h1 className="mt-3 flex items-center gap-3 text-4xl font-bold tracking-tight sm:text-5xl">
                  Hey, I&apos;m Carlson
                  <FontAwesomeIcon
                    icon={faHand}
                    className="text-3xl text-primary sm:text-4xl"
                  />
                </h1>
              </AnimatedSection>
              <AnimatedSection delay={0.15}>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-text-muted">
                  I got my start at a bootcamp at Javi RSS Hub, where I
                  discovered the magic of building things with code. That spark
                  never faded — now I&apos;m focused on creating tools that help
                  students and young people in my community.
                </p>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ── What I do now ── */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <AnimatedSection delay={0.15}>
            <div className="flex items-start gap-4 rounded-xl border border-border bg-surface-alt p-6">
              <div className="mt-0.5 rounded-lg bg-primary/10 p-2.5 text-primary">
                <Rocket size={20} />
              </div>
              <div>
                <h2 className="font-semibold">What I do right now</h2>
                <p className="mt-1 text-text-muted">
                  I&apos;m building <strong>Campus Mart</strong> — a digital
                  marketplace for university campuses — and supporting the{" "}
                  <strong>Teens Aloud Foundation</strong>, a platform that
                  empowers young people through mentorship and advocacy.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Fun facts / personality ── */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <AnimatedSection delay={0.1}>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              A few things about me
            </h2>
          </AnimatedSection>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <AnimatedSection delay={0.15}>
              <FactCard
                icon={<FontAwesomeIcon icon={faTrophy} className="h-5 w-5" />}
                title="Biggest win so far"
                text="Campus Mart — building a real marketplace that students actually use. It taught me more than any tutorial ever could."
              />
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <FactCard
                icon={<FontAwesomeIcon icon={faFish} className="h-5 w-5" />}
                title="Fishing & Football"
                text="When I'm not coding, you'll find me fishing by the river or playing football. Great for clearing the head."
              />
            </AnimatedSection>
            <AnimatedSection delay={0.25}>
              <FactCard
                icon={<FontAwesomeIcon icon={faBookOpen} className="h-5 w-5" />}
                title="Currently learning"
                text="Deepening my Next.js skills and learning Python from scratch. Always a student."
              />
            </AnimatedSection>
            <AnimatedSection delay={0.3}>
              <FactCard
                icon={<FontAwesomeIcon icon={faRocket} className="h-5 w-5" />}
                title="Ship fast, learn faster"
                text="I'd rather deploy something real and improve it than plan forever."
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Why I do this ── */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <AnimatedSection>
            <div className="flex items-start gap-4 rounded-xl border border-border p-6">
              <div className="mt-0.5 rounded-lg bg-primary/10 p-2.5 text-primary">
                <Heart size={20} />
              </div>
              <div>
                <h2 className="font-semibold">Why I build things</h2>
                <p className="mt-1 text-text-muted">
                  I believe technology should serve the people closest to the
                  problems. Every project I work on starts with a simple
                  question:{" "}
                  <em className="text-text">
                    &quot;How can this make someone&apos;s life a little
                    easier?&quot;
                  </em>
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Quick info ── */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <AnimatedSection>
            <div className="grid gap-6 sm:grid-cols-3">
              <InfoItem
                icon={<MapPin size={18} />}
                label="Location"
                value={siteConfig.location}
              />
              <InfoItem
                icon={<Mail size={18} />}
                label="Email"
                value={siteConfig.email}
              />
              <InfoItem
                icon={<Calendar size={18} />}
                label="Available for"
                value="Freelance & Collaborations"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Skills ── */}
      <Section
        title="What I work with"
        description="Technologies and tools I reach for most."
        className="bg-surface-alt"
      >
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: <Code size={20} />, title: "Frontend", items: skills.frontend },
            { icon: <Server size={20} />, title: "Backend", items: skills.backend },
            { icon: <Wrench size={20} />, title: "Tools", items: skills.tools },
          ].map((skill, i) => (
            <AnimatedSection key={skill.title} delay={i * 0.1}>
              <SparkleEffect>
                <SkillCard
                  icon={skill.icon}
                  title={skill.title}
                  items={skill.items}
                />
              </SparkleEffect>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* ── CTA ── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <AnimatedSection>
            <Sparkles className="mx-auto text-primary" size={24} />
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Want to work together?
            </h2>
            <p className="mt-3 text-text-muted">
              I&apos;m always open to interesting conversations and
              collaborations.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
            >
              Say hello <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

function FactCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="glow-card rounded-xl border border-border p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-text-muted">{text}</p>
    </div>
  );
}
