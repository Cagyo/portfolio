type TagProps = {
  children: React.ReactNode
  variant?: "amber" | "neutral" | "green"
}

export function Tag({ children, variant = "amber" }: TagProps) {
  const cls = {
    amber: "tag",
    neutral: "tag-neutral",
    green: "tag-green",
  }[variant];

  return <span className={cls}>{children}</span>;
}
