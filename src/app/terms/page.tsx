export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Terms of Service</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Last updated: May 2026</p>
      <div className="mt-8 prose prose-zinc dark:prose-invert max-w-none">
        <h2>Service</h2>
        <p>AI ToolBox Online provides AI-powered image processing and document conversion tools. Service availability is subject to third-party API availability.</p>
        <h2>Usage</h2>
        <p>You may use our tools for personal and commercial purposes. You retain full ownership of your input and output files.</p>
        <h2>Refunds</h2>
        <p>Unused credits are non-refundable. If you experience issues with our service, please contact us for a resolution.</p>
      </div>
    </div>
  );
}
