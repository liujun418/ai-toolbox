export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Privacy Policy</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Last updated: May 2026</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">1. Information We Collect</h2>
          <p className="mt-2">We collect minimal information necessary to provide our services:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li><strong>Account Information</strong>: Email address and name when you create an account.</li>
            <li><strong>Usage Data</strong>: Tool usage logs for billing and credit management.</li>
            <li><strong>Payment Data</strong>: Processed securely by Stripe. We do not store your payment card details.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">2. File Handling</h2>
          <p className="mt-2">All uploaded files and processed outputs are automatically deleted from our servers within 1 hour of processing. We do not store, share, or use your images for training AI models. You retain full ownership of all files you upload and generate.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">3. Third-Party Services</h2>
          <p className="mt-2">We use the following third-party services to deliver our platform:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li><strong>Replicate API</strong>: For AI image processing (avatar generation, background removal, photo restoration).</li>
            <li><strong>Stripe</strong>: For secure payment processing.</li>
            <li><strong>Cloudflare R2</strong>: For temporary file storage during processing.</li>
          </ul>
          <p className="mt-2">Each service operates under its own privacy policy.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">4. Data Security</h2>
          <p className="mt-2">We use industry-standard encryption (HTTPS/TLS) for all data in transit. Authentication tokens are stored securely in your browser's local storage. We regularly review our security practices.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">5. Your Rights</h2>
          <p className="mt-2">You have the right to access, correct, or delete your personal data at any time. To request account deletion, contact us at jzerov@live.com.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">6. Contact</h2>
          <p className="mt-2">For privacy-related inquiries, contact us at <a href="mailto:jzerov@live.com" className="text-blue-600 hover:underline">jzerov@live.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
