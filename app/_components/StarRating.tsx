import { StarIcon } from "@/assets/icons/StarIcon";

type StarRatingProps = {
  count?: number
  starClassName?: string
}

export function StarRating({ count = 5, starClassName = "w-3.5 h-3.5 text-amber-foreground" }: StarRatingProps) {
  return (
    <div className="flex gap-0.5 flex-shrink-0">
      {Array.from({ length: count }).map((_, index) => (
        <StarIcon key={index} className={starClassName} />
      ))}
    </div>
  )
}
