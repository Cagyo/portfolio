import { EmptyFaceIcon } from "../../assets/icons/EmptyFaceIcon";

type EmptyStateProps = {
  query: string
  onClear: () => void
}

export function EmptyState({ query, onClear }: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      <EmptyFaceIcon className="w-10 h-10 text-white/10 mx-auto mb-3" />
      <p className="text-white/30 text-sm">No results for &ldquo;{query}&rdquo;</p>
      <button
        onClick={onClear}
        className="mt-3 text-amber-500 text-xs hover:text-amber-400 cursor-pointer underline underline-offset-2"
      >
        Clear search
      </button>
    </div>
  );
}
