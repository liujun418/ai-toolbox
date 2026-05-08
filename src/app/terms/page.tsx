export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Terms of Service</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Last updated: May 2026</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">1. Service Description</h2>
          <p className="mt-2">AI ToolBox Online provides AI-powered image processing and document conversion tools, including background removal, avatar generation, watermark removal, photo restoration, and PDF-to-Word conversion. Service availability is subject to third-party API availability.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">2. Acceptable Use</h2>
          <p className="mt-2">You may use our tools for personal and commercial purposes. You retain full ownership of your input and output files. You agree not to:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Use our service to process content that violates applicable laws or infringes on others' rights.</li>
            <li>Automate or scrape our service without permission.</li>
            <li>Share your account credentials or resell our credits.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">3. Credits and Billing</h2>
          <p className="mt-2">Free accounts receive 5 credits per month. Paid credits are purchased via Stripe and refresh with your billing cycle. Unused paid credits roll over within the same billing cycle. <strong>Free tier credits reset monthly. Unused credits are non-refundable.</strong></p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">4. Refunds</h2>
          <p className="mt-2">Unused credits are non-refundable. If you experience issues with our service, please contact us at jzerov@live.com for a resolution. We will make every reasonable effort to address your concerns.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">5. Limitation of Liability</h2>
          <p className="mt-2">AI ToolBox Online is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service. We are not liable for any indirect, incidental, or consequential damages arising from use of our service.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">6. Intellectual Property</h2>
          <p className="mt-2">The AI ToolBox Online platform, including its design, code, and branding, is protected by intellectual property rights. You retain ownership of your uploaded files and generated outputs.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">7. Changes to Terms</h2>
          <p className="mt-2">We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the updated terms.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">8. Contact</h2>
          <p className="mt-2">For any questions regarding these terms, contact us at <a href="mailto:jzerov@live.com" className="text-blue-600 hover:underline">jzerov@live.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
