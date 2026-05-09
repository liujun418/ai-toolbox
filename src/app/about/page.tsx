import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — AI ToolBox Online",
  description: "Learn more about AI ToolBox Online and our mission to make AI-powered tools accessible to everyone.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">About AI ToolBox Online</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Our mission and story</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Our Mission</h2>
          <p className="mt-2">
            AI ToolBox Online was built with a simple idea: everyone should have access to powerful AI tools without expensive software subscriptions or technical expertise. Whether you're a small business owner creating professional avatars, a student converting PDFs for assignments, or a designer removing watermarks — our tools are designed to be fast, intuitive, and accessible from any device.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">What We Offer</h2>
          <p className="mt-2">We provide 5 AI-powered tools:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li><strong>Background Remover</strong> — One-click background removal for any image</li>
            <li><strong>AI Avatar Generator</strong> — Transform photos into cartoon, anime, or professional avatars</li>
            <li><strong>Watermark Remover</strong> — Erase watermarks, logos, and text from images</li>
            <li><strong>Photo Restorer</strong> — Restore and colorize old, blurry, or damaged photos</li>
            <li><strong>PDF to Word</strong> — Convert PDF documents to editable Word files</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">How It Works</h2>
          <p className="mt-2">
            We use industry-leading AI models via Replicate API — including Stable Diffusion for image generation and GFPGAN for photo restoration. All processing happens in the cloud; you just upload your file and get results in seconds. Files are automatically deleted after 1 hour to protect your privacy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Pricing Philosophy</h2>
          <p className="mt-2">
            We believe in transparent, pay-as-you-go pricing. No monthly subscriptions forced on you. Get 5 free credits every month, and only pay when you need more. Every tool shows its credit cost upfront so there are no surprises.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Contact</h2>
          <p className="mt-2">
            Have questions or feedback? Reach us at{" "}
            <a href="mailto:jzerov@live.com" className="text-blue-600 hover:underline">jzerov@live.com</a>{" "}
            or visit our <Link href="/contact" className="text-blue-600 hover:underline">contact page</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
