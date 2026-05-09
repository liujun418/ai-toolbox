import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — AI ToolBox Online",
  description: "Get in touch with the AI ToolBox Online team for support, feedback, or inquiries.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Contact Us</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">We'd love to hear from you</p>

      <div className="mt-8 space-y-8">
        {/* Email */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Email</h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            For general inquiries, support, or feedback:
          </p>
          <a href="mailto:jzerov@live.com" className="mt-2 inline-block text-blue-600 hover:underline">
            jzerov@live.com
          </a>
        </div>

        {/* Response Time */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Response Time</h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            We aim to respond to all inquiries within 24 hours. For urgent matters, please include "URGENT" in your email subject line.
          </p>
        </div>

        {/* FAQ */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Common Questions</h2>
          <div className="mt-4 space-y-4">
            {[
              {
                q: "How do I get more credits?",
                a: "Visit our Pricing page to purchase credits starting from $4.99 for 50 credits.",
              },
              {
                q: "My file processing failed. What should I do?",
                a: "Please email us with the tool name, file type, and any error message you received. We'll investigate and refund credits if needed.",
              },
              {
                q: "Can I use the outputs commercially?",
                a: "Yes. You retain full ownership of all files you upload and generate through our tools.",
              },
            ].map((item) => (
              <details key={item.q} className="group">
                <summary className="cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {item.q}
                </summary>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
