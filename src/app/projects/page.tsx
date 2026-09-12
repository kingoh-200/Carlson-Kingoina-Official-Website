"use client";

import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import AnimatedSection from "@/components/AnimatedSection";
import LikeButton from "@/components/LikeButton";
import { projects } from "@/lib/data";

export default function ProjectsPage() {
  return (
    <>
      <Section title="Projects" description="Things I've built, shipped, and open-sourced." className="pt-8 sm:pt-24">
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <AnimatedSection key={project.title} delay={i * 0.1}>
              <ProjectCard project={project} />
            </AnimatedSection>
          ))}
        </div>
      </Section>
      <AnimatedSection delay={0.2}>
        <div className="px-4 pb-12 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-6xl">
            <LikeButton page="projects" />
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
