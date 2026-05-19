type PulseBadgeProps = {
  children: React.ReactNode
}

export function PulseBadge({ children }: PulseBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 glass-amber rounded-full px-4 py-2">
      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow" />
      <span className="text-sm text-amber-foreground font-medium">{children}</span>
    </div>
  );
}
