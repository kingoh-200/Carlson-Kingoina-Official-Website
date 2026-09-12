import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Hello, I&apos;m
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
          Carlson Kingoina
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-muted">
          A developer and creator building things for the web. I love working
          with modern tools, open source, and turning ideas into products.
        </p>
        <div className="mt-8 flex flex-col gap-3 min-[400px]:flex-row min-[400px]:gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            View Projects <ArrowRight size={16} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-surface-alt"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
}
