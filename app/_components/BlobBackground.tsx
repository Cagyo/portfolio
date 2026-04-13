type BlobBackgroundProps = {
  size?: string
  color?: string
  position?: string
  opacity?: number
}

export function BlobBackground({
  size = "w-96 h-96",
  color = "bg-amber-500",
  position = "top-20 -left-32",
  opacity,
}: BlobBackgroundProps) {
  return (
    <div
      className={`blob ${size} ${color} ${position}`}
      style={opacity !== undefined ? { opacity } : undefined}
    />
  );
}
