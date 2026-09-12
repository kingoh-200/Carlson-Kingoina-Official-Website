interface SkillCardProps {
  icon: React.ReactNode;
  title: string;
  items: string[];
}

export function SkillCard({ icon, title, items }: SkillCardProps) {
  return (
    <div className="card-pop rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="text-primary">{icon}</div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm text-text-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-primary">{icon}</span>
      <div>
        <p className="text-xs uppercase tracking-wider text-text-muted">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
