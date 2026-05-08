export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Privacy Policy</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Last updated: May 2026</p>
      <div className="mt-8 prose prose-zinc dark:prose-invert max-w-none">
        <h2>Data Collection</h2>
        <p>We collect minimal data necessary to provide our services: email address, account information, and usage logs for billing purposes.</p>
        <h2>File Handling</h2>
        <p>All uploaded files are automatically deleted from our servers within 1 hour of processing. We do not store, share, or use your images for training AI models.</p>
        <h2>Third-Party Services</h2>
        <p>We use Replicate API for AI image processing, Stripe for payment processing, and Cloudflare R2 for temporary file storage. Each service has its own privacy policy.</p>
      </div>
    </div>
  );
}
