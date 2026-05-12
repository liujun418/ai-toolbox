export function ToolSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="mb-2 h-4 w-48 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="mb-2 h-8 w-80 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-4 w-64 rounded bg-zinc-100 dark:bg-zinc-800" />
      </div>
      <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
        <div className="aspect-square w-full rounded-xl bg-zinc-100 dark:bg-zinc-800" />
      </div>
    </div>
  );
}
