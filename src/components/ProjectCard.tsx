"use client";

import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { useRef, useCallback } from "react";

export interface Project {
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export default function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="card-pop glow-card group rounded-xl border border-border bg-surface p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
        {project.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        {project.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-border bg-surface-alt px-2.5 py-1 text-xs font-medium text-text-muted transition-colors group-hover:border-primary/20 group-hover:text-text hover:bg-primary/10 hover:text-primary"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        {project.liveUrl && (
          <Link
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline inline-flex items-center gap-1.5 py-1 text-sm font-medium text-primary"
          >
            Live <ExternalLink size={14} />
          </Link>
        )}
        {project.githubUrl && (
          <Link
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-primary"
          >
            Code <Github size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}
