type SpinnerSize = "sm" | "md";

const sizeClass: Record<SpinnerSize, string> = {
  sm: "size-4 border-2",
  md: "size-9 border-2",
};

export function Spinner({ size = "md" }: { size?: SpinnerSize }) {
  return (
    <span
      className={`inline-block shrink-0 rounded-full border-border border-t-accent animate-spin ${sizeClass[size]}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PendingPanel({ message }: { message: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface-raised/95 px-8 py-7 shadow-lg backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <Spinner size="md" />
      <p className="text-center text-sm text-muted">{message}</p>
    </div>
  );
}
