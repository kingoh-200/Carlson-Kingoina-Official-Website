import clsx from "clsx";

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function Section({
  title,
  description,
  children,
  className,
  id,
}: SectionProps) {
  return (
    <section id={id} className={clsx("px-4 py-14 sm:px-6 sm:py-16 lg:px-10", className)}>
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-2xl text-text-muted">{description}</p>
        )}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
