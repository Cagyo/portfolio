type Stat = { value: string; label: string }

type StatRowProps = {
  stats: Stat[]
}

export function StatRow({ stats }: StatRowProps) {
  return (
    <div className="flex gap-10 pt-4">
      {stats.map((stat, index) => (
        <div key={stat.label} className="flex gap-10 items-start">
          {index > 0 && <div className="w-px bg-foreground/8 self-stretch" />}
          <div>
            <p className="font-heading font-black text-3xl text-gradient">{stat.value}</p>
            <p className="text-faint-foreground text-sm mt-1">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
