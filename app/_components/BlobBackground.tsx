type BlobBackgroundProps = {
  size?: string
  color?: string
  position?: string
  opacity?: string
  delay?: string
}

export function BlobBackground({
  size = "w-96 h-96",
  color = "bg-amber-500",
  position = "top-20 -left-32",
  opacity,
  delay,
}: BlobBackgroundProps) {
  return (
    <div
      className={`blob ${size} ${color} ${position}`}
      style={{
        ...(delay !== undefined ? { animationDelay: delay } : {}),
        ...(opacity !== undefined ? { opacity: parseFloat(opacity) } : {}),
      }}
    />
  );
}
