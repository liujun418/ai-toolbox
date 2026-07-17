"""Add 6 blogs to AI station (166→172 static) — July 17, 2026"""
import os, sys

BLOG_FILE = r"C:\Users\jun\ai-toolbox\src\lib\blog.ts"

with open(BLOG_FILE, "r", encoding="utf-8") as f:
    content = f.read()

old = '\n];\n\n// Synchronous static accessors'

new_blogs = r"""
  {
    slug: "avatar-generator-virtual-events-webinar-speaker",
    title: "AI Avatar Generator for Virtual Events How to Create Professional Speaker Profile Photos for Webinars Conferences and Online Panels",
    description: "Your webinar has 12 speakers across 6 time zones. Nobody has a consistent headshot. AI avatars create professional, unified speaker photos for the event page in under an hour. Here's the workflow.",
    date: "2026-07-17",
    category: "Generate",
    tags: ["AI avatar", "virtual events", "webinar", "speaker", "conference"],
    relatedTools: ["avatar-generator", "background-remover", "ai-image-generator"],
    content: `<p>You are organizing a virtual conference. Twelve speakers from six time zones. The event page goes live in 48 hours. You need a professional headshot for each speaker. Three speakers sent you high-resolution corporate photos. Four sent you selfies cropped from wedding photos. Three sent you nothing. One sent you a photo of their cat. The speaker lineup page currently looks like a ransom note — twelve different photos in twelve different styles, lighting conditions, and resolutions.</p>

<p>An <a href="/en/tools/avatar-generator">AI avatar generator</a> solves this in under an hour. Generate a consistent, professional headshot for every speaker using the same style template. The result: a speaker lineup that looks curated, professional, and intentional. Here is the virtual event speaker photo workflow.</p>

<h2>Step 1: Define the Speaker Photo Style</h2>

<p>Write a style prompt that will be applied to every speaker's avatar. The style should match the event's brand: formal corporate conference (dark suit, professional lighting, neutral gray background), casual tech meetup (smart casual, natural lighting, clean white background), creative industry panel (artistic lighting, colorful background, expressive poses), or academic symposium (business attire, library or campus background, warm lighting).</p>

<p>Example style prompt for a corporate conference: "Professional corporate headshot, business attire, soft studio lighting, neutral gray gradient background, centered composition, friendly but professional expression, sharp focus, consistent quality." This template is used for every speaker. The individual descriptions vary. The style is constant.</p>

<h2>Step 2: Generate Each Speaker's Avatar</h2>

<p>For each speaker, write a brief description: gender, age range, hair style and color, facial features, and glasses if applicable. Example: "Male speaker, mid-40s, short graying brown hair, close-trimmed beard, wire-rimmed glasses, warm smile." The AI generates an avatar that matches this description in the defined style. The avatar is a stylized representation, not a photographic replica. It looks like the speaker enough to be recognizable — and consistent enough to belong in the lineup.</p>

<p>Generate 3-5 variations per speaker. Pick the best one. The goal is not exact likeness. The goal is <strong>professional representation</strong> — a photo that looks like it belongs on a speaker lineup, not on a driver's license.</p>

<h2>Step 3: Unify the Background and Framing</h2>

<p>After generating all avatars, use the <a href="/en/tools/background-remover">background remover</a> to extract each avatar onto a transparent background. Place all avatars on the exact same background — the same color, the same gradient, the same treatment. Crop all avatars to the same dimensions — the same framing, the same zoom level, the same head position. The consistent background + consistent framing = a speaker lineup that looks like it was photographed by the same photographer in the same studio.</p>

<h2>When AI Avatars Work for Events (and When They Don't)</h2>

<p>AI avatars work well for: virtual event speaker pages (the photos are viewed at thumbnail size on the agenda page), large-scale events with many speakers (getting real photos from everyone is logistically impossible), and internal company events (the audience knows the speakers — the avatars are visual identifiers, not identity verifications).</p>

<p>AI avatars work less well for: in-person events where speakers will be on stage (the audience will see the real person and compare them to the avatar), events where exact likeness matters (legal, medical, or credential-based events), and keynote speakers (the face of the event deserves a real photo).</p>

<p>Build your speaker lineup at <a href="/en/tools/avatar-generator">AI avatar generator</a> — twelve speakers, one style, consistent and professional in under an hour.</p>`
  },
  {
    slug: "image-upscaler-digital-art-prints-canvas-gallery",
    title: "Image Upscaler for Digital Art Prints How to Prepare Your Digital Artwork for Canvas Prints Posters and Gallery-Quality Large Format Output",
    description: "Your digital painting is 3000×2000 pixels — beautiful on screen but only 10×6.7 inches at 300 DPI print quality. AI upscaling prepares it for 24×36 canvas prints. Here's the print preparation workflow.",
    date: "2026-07-17",
    category: "Edit",
    tags: ["image upscaler", "digital art", "print", "canvas", "gallery quality"],
    relatedTools: ["image-upscaler", "ai-image-generator", "background-remover"],
    content: `<p>You are a digital artist. A collector wants to buy a 24×36 inch canvas print of your latest work. The digital file is 3000×2000 pixels. At 300 DPI — the standard for gallery-quality prints — that is only 10×6.7 inches. Printed at 24×36, the resolution drops to 125 DPI. The print will look soft, pixelated, and amateur. The collector will not be happy. You need to increase the image resolution without losing the quality of your artwork.</p>

<p>An <a href="/en/tools/image-upscaler">AI image upscaler</a> solves this. The AI increases the pixel dimensions while preserving — and sometimes enhancing — the details, textures, and edges of your artwork. Here is the digital art print preparation workflow.</p>

<h2>Calculate the Required Resolution</h2>

<p>The formula: <strong>Required pixels = Print size (inches) × DPI.</strong> A 24×36 inch print at 300 DPI requires 7200×10800 pixels. Your source image is 3000×2000 pixels. You need a 3.6× upscale to reach the required resolution. The AI upscaler can handle this — but the quality depends on the type of artwork.</p>

<p>For the 3.6× upscale: upscale in stages if your tool supports it — 2× first (3000×2000 → 6000×4000), then crop and upscale again to reach the exact dimensions. A single large upscale can produce artifacts. Two moderate upscales produce better results. The intermediate step gives the AI a higher-quality source for the second upscale.</p>

<h2>Artwork-Specific Upscaling Strategies</h2>

<p><strong>Digital paintings with brush textures:</strong> The AI should preserve the brushstroke texture, not smooth it. A smoothed brushstroke looks like a digital blur. The AI upscaler that recognizes texture patterns will enhance the brushstrokes rather than eliminate them. Test the upscaled result at 100% zoom — the brush textures should be visible and natural, not smoothed into gradients.</p>

<p><strong>Vector-style artwork with hard edges:</strong> The AI should preserve the crisp lines, not anti-alias them. A anti-aliased hard edge looks like a blurred line. The AI upscaler that recognizes geometric patterns will keep the edges sharp. The upscaled version should look like a higher-resolution rendering of the same vector art.</p>

<p><strong>Photographic-style digital art:</strong> The AI should enhance details without inventing them. The upscaled version should look like the same scene photographed at a higher resolution — sharper details, finer textures, but no hallucinated elements. Review the upscaled result carefully for invented details in complex areas.</p>

<p><strong>Artwork with text or signatures:</strong> The AI should keep the text sharp and legible. Blurry text in a print is the most visible quality failure. Text is the hardest element for AI upscalers to handle because letterforms are precise and the human eye is extremely sensitive to text distortion. Check the artist's signature at 100% zoom — it should look like it was written at the higher resolution.</p>

<h2>Post-Upscale Verification</h2>

<p>After upscaling, check the image at 100% zoom. Focus on: edges (are they sharp or blurred?), textures (preserved or smoothed?), gradients (smooth or banded?), and fine details (enhanced or invented?). If the upscaled image looks sharp at 100% zoom on screen, it will look sharp in print. If it looks soft or artifacted on screen, the print will magnify those flaws.</p>

<p>Prepare your artwork for print at <a href="/en/tools/image-upscaler">AI image upscaler</a> — calculate the DPI, upscale in stages, and verify at 100% zoom before sending to the printer.</p>`
  },
  {
    slug: "article-generator-email-newsletter-weekly-digest",
    title: "Article Generator for Email Newsletters How to Automate Your Weekly Digest Without Sounding Like a Robot",
    description: "You send a weekly newsletter to 10,000 subscribers. Writing original content every week is exhausting. An AI article generator drafts the content — you add the personal touch. Here's the newsletter automation workflow.",
    date: "2026-07-17",
    category: "Content",
    tags: ["article generator", "email newsletter", "weekly digest", "automation", "content marketing"],
    relatedTools: ["article-generator", "text-polish", "text-to-speech"],
    content: `<p>You have been sending a weekly newsletter for three years. Every Tuesday, 10,000 subscribers receive an email with: a personal introduction, a main article (800 words), 3 curated links with commentary, and a personal sign-off. Total writing time: 4-6 hours per week. That is 200-300 hours per year spent on newsletter content. You are burning out. The quality is slipping. The personal introduction is becoming formulaic. The commentary is becoming perfunctory. Your subscribers can tell.</p>

<p>An <a href="/en/tools/article-generator">AI article generator</a> handles the heavy lifting — the main article and link commentary. You handle the personal elements — the introduction and sign-off. The AI writes 80% of the content. You write the 20% that makes it <strong>your</strong> newsletter. Here is the newsletter automation workflow that maintains quality while cutting writing time in half.</p>

<h2>The 80/20 Newsletter Workflow</h2>

<p><strong>Step 1: The personal introduction (human-written, 10% of the content).</strong> Write this yourself. It is 100-200 words of personal context — what you have been thinking about this week, a story from your life, a lesson you learned. This is the section that builds connection with your readers. The AI cannot write this because the AI does not have your life. The personal introduction is the <strong>authenticity anchor</strong> of your newsletter. It proves there is a real person behind the content.</p>

<p><strong>Step 2: The main article (AI-drafted, 60% of the content).</strong> Use the <a href="/en/tools/article-generator">AI article generator</a> to draft the main article. Provide the topic, the key points you want to cover, and any specific examples or data you want included. The AI produces a structured, well-written first draft. You edit it — add your voice, your examples, your perspective. The AI provides the structure and the bulk of the text. You provide the insight and the personality.</p>

<p><strong>Step 3: Curated links with AI commentary (AI-drafted, 20% of the content).</strong> Give the AI the three links and ask for a 2-3 sentence commentary on each — why this link is interesting, what the key takeaway is, and why your subscribers should care. The AI drafts the commentary. You review and adjust. The AI summarizes. You contextualize.</p>

<p><strong>Step 4: The personal sign-off (human-written, 10% of the content).</strong> Write this yourself. A question for your readers, an invitation to reply, a personal note. The sign-off is the <strong>relationship builder</strong>. It invites conversation. It makes the newsletter a dialogue, not a broadcast. The AI cannot write this because it cannot have a relationship with your readers.</p>

<h2>Why This Workflow Preserves Quality</h2>

<p>The AI handles the information-dense sections — the main article and link commentary. These sections benefit from clear structure, correct grammar, and concise writing. The AI excels at this. You handle the personality-dense sections — the introduction and sign-off. These sections benefit from authenticity, personal experience, and a distinctive voice. The AI cannot do this. You can. The division of labor plays to each writer's strengths. The AI is the researcher and drafter. You are the voice and the face. Together, the newsletter maintains quality while cutting writing time from 4-6 hours to 1-2 hours.</p>

<p>Draft your next newsletter at <a href="/en/tools/article-generator">AI article generator</a> — let the AI write 80%, you write the 20% that matters most.</p>`
  },
  {
    slug: "pdf-to-word-academic-research-literature-review",
    title: "PDF to Word for Academic Research How to Organize Your Literature Review by Converting Dozens of PDF Papers into Searchable Editable Text",
    description: "Your literature review requires reading 80 papers. They are all PDFs — some searchable, some scanned. Converting them to editable text makes them searchable, quotable, and organizable. Here's the research workflow.",
    date: "2026-07-17",
    category: "Document",
    tags: ["PDF to Word", "academic research", "literature review", "papers", "organization"],
    relatedTools: ["pdf-to-word", "text-polish", "article-generator"],
    content: `<p>You are writing a literature review for your thesis. You have collected 80 papers. They are all PDFs. Some are digitally created — the text is selectable and searchable. Some are scanned from printed journals — the text is an image, not searchable at all. Some are a mix — the first page is digital metadata, the rest is scanned content. You need to: search across all 80 papers for specific terms and concepts, quote key passages with proper citations, and organize the findings thematically.</p>

<p>Working with 80 individual PDFs is a research nightmare. Finding a specific quote means opening each PDF, searching (if it is searchable), scrolling, and hoping you remember which paper said what. A <a href="/en/tools/pdf-to-word">PDF to Word converter</a> that handles both digital and scanned PDFs transforms this workflow. Here is the literature review organization system.</p>

<h2>Step 1: Convert All PDFs to Searchable Text</h2>

<p>Process all 80 papers through the PDF to Word converter. For digital PDFs, the text is extracted directly. For scanned PDFs, OCR converts the image to text. For mixed PDFs, both methods are applied. The output is a searchable Word document for each paper. The conversion quality depends on the original: digital PDFs convert at 99%+ accuracy, clean scans convert at 95-98% accuracy, and old or damaged scans convert at 85-95% accuracy (handwritten notes, faded text, and complex layouts reduce accuracy).</p>

<p>The converted documents are now <strong>searchable</strong>. You can use your computer's search function to find any term across all 80 papers. A search for "epistemological framework" finds every paper that uses that phrase. The same search in 80 individual PDFs — many of which are not searchable — would be impossible.</p>

<h2>Step 2: Extract Key Quotes with Citations</h2>

<p>As you read each paper, copy key quotes into a master research document. Include: the quote, the author, year, and page number, and your annotation (why this quote is relevant to your research). The PDF to Word conversion makes copying quotes easy — the text is editable, so you can select, copy, and paste directly. With a scanned PDF, you would have to retype each quote manually. The conversion saves hours of transcription time.</p>

<p>Organize the quotes thematically in your master document. Group related quotes together. The thematic organization becomes the outline for your literature review. Each theme becomes a section. Each group of quotes becomes the evidence for that section's argument.</p>

<h2>Step 3: Verify Quotes Against the Original PDF</h2>

<p>OCR is not perfect. Before using a quote in your thesis, verify it against the original PDF. Check: proper names (OCR often mangles names — "Bourdieu" might become "Bourdieu" or "B0urdieu"), numbers and statistics (a misrecognized digit changes the meaning), and technical terminology (OCR might replace a field-specific term with a similar-looking common word).</p>

<p>The verification adds time, but it prevents the embarrassment of citing a misquoted source. The PDF to Word conversion is a <strong>search and discovery tool</strong>, not a final transcript. Use it to find the relevant passages. Verify the exact wording against the original. The conversion gets you to the right page. The original confirms the right words.</p>

<h2>Step 4: Archive the Converted Documents</h2>

<p>Save the original PDF and the converted Word document together. The PDF is the authoritative version — the journal-published record. The Word document is the working copy — the searchable, quotable, editable version. Both are part of your research archive. The PDF proves provenance. The Word document enables productivity.</p>

<p>Convert your research papers at <a href="/en/tools/pdf-to-word">PDF to Word converter</a> — 80 papers, searchable, quotable, organizable. Your literature review just got easier.</p>`
  },
  {
    slug: "colorizer-vs-photo-restorer-which-first",
    title: "Colorizer vs Photo Restorer for Old Photos Which One Should You Use First — and Why the Order Matters More Than You Think",
    description: "You have an old, damaged black-and-white photo. Should you restore the damage first, then colorize? Or colorize first, then restore? The order changes the result. Here's the correct pipeline.",
    date: "2026-07-17",
    category: "Edit",
    tags: ["colorizer", "photo restorer", "pipeline", "old photos", "restoration"],
    relatedTools: ["colorizer", "photo-restorer", "image-upscaler"],
    content: `<p>You have a 70-year-old black-and-white photo. It is faded, scratched, and has a crease running through the middle. You want to: restore the damage (remove scratches, fix the crease, enhance contrast) and colorize the photo (add realistic color). You have a <a href="/en/tools/photo-restorer">photo restorer</a> and a <a href="/en/tools/colorizer">colorizer</a>. Which one do you use first?</p>

<p>The answer: <strong>restore first, then colorize</strong>. The order matters more than you think — and using the wrong order produces worse results that cannot be fixed without starting over. Here is the correct pipeline and why the order matters.</p>

<h2>Why Restore First, Then Colorize</h2>

<p><strong>Reason 1: Damage confuses the colorizer.</strong> A scratch across a person's face is a high-contrast artifact. The AI colorizer sees the scratch as a feature of the image and assigns it a color — usually a skin tone or a gray tone. The scratch becomes a colored line across the face. The colorization locks in the scratch as a permanent feature. If you colorize first and then try to remove the scratch, the repair must match the surrounding colored area — which is harder than repairing a grayscale area. Restoring first removes the scratch before it can be colorized.</p>

<p><strong>Reason 2: Fading affects color accuracy.</strong> A faded photo has low contrast. The AI colorizer uses contrast information to determine color boundaries — the edge between a person's hair and the background, the boundary between a shirt and a jacket. Low contrast makes these boundaries ambiguous. The colorizer guesses where the boundaries are and applies colors based on those guesses. The result: colors bleeding across boundaries. Restoring first enhances the contrast, which gives the colorizer cleaner boundaries to work with.</p>

<p><strong>Reason 3: Stains and discoloration mislead the colorizer.</strong> A yellowed or sepia-toned photo has a color cast. The AI colorizer sees the yellow or sepia as the actual color of the image and may incorporate it into the colorization. A yellow-stained white shirt becomes a yellow shirt. A sepia-toned sky becomes a brown sky. Restoring first neutralizes the color cast, giving the colorizer a clean monochrome image to work from.</p>

<h2>The Correct Pipeline: Restore → Colorize → Review</h2>

<p><strong>Step 1: Scan the original photo at the highest possible resolution.</strong> 600 DPI minimum. The original scan is the master file. All restoration and colorization are derived from this master. Never modify the master directly.</p>

<p><strong>Step 2: Restore with the photo restorer.</strong> Use the <a href="/en/tools/photo-restorer">photo restorer</a> to: remove scratches, dust, and physical damage, fix creases and folds, enhance contrast and sharpness, and neutralize color casts (sepia, yellowing). The output is a clean, high-contrast black-and-white image.</p>

<p><strong>Step 3: Colorize with the colorizer.</strong> Feed the restored black-and-white image to the <a href="/en/tools/colorizer">colorizer</a>. The clean image gives the AI the best possible input. The colors will be more accurate, the boundaries will be cleaner, and the result will look more natural.</p>

<p><strong>Step 4: Review the colorized result.</strong> Check for: color bleeding across boundaries, colors that look unnatural (a green face, a purple sky), and artifacts introduced by either the restoration or the colorization. The colorized result is a <strong>derived work</strong>. The original scan is the master. Keep both.</p>

<h2>When to Do It Differently</h2>

<p>There is one exception: if the photo has <strong>severe fading</strong> where you cannot tell what the image depicts, colorizing first might help you identify the content — which parts are faces, which are clothing, which are background. The colorization adds information that helps you see the image more clearly. Then you can restore the original black-and-white scan more effectively with that understanding. Then you can colorize the restored version for the final output. In this case, the pipeline becomes: colorize (for analysis) → restore (with the understanding gained) → colorize (for final output). But this is the exception, not the rule.</p>

<p>For 95% of old photos, the pipeline is: <strong>restore first, then colorize</strong>. The order is the difference between a natural-looking colorized photo and one where the scratches and stains are now permanently colored. Restore at <a href="/en/tools/photo-restorer">photo restorer</a>, then colorize at <a href="/en/tools/colorizer">colorizer</a>. The right order. The right result.</p>`
  },
  {
    slug: "image-description-cnn-to-vision-transformer-evolution",
    title: "How AI Image Description Works From Convolutional Neural Networks to Vision Transformers — the 15-Year Evolution of Teaching Computers to See",
    description: "In 2012, AI could say 'this is a cat.' In 2026, it can describe the cat's breed, color, position, expression, and the room it is sitting in. Here's the technological evolution that made it possible.",
    date: "2026-07-17",
    category: "Content",
    tags: ["image description", "CNN", "Vision Transformer", "computer vision", "evolution"],
    relatedTools: ["image-description", "style-transfer", "ai-image-generator"],
    content: `<p>In 2012, AlexNet — a convolutional neural network (CNN) with 60 million parameters — won the ImageNet competition by classifying images into 1,000 categories with 15.3% top-5 error. The AI could look at a photo and say "this is a cat." That was the state of the art. The AI could not tell you what kind of cat, where the cat was, what the cat was doing, or anything about the room the cat was in. Just "cat."</p>

<p>In 2026, an <a href="/en/tools/image-description">AI image description</a> tool can look at the same photo and say: "An orange tabby cat with green eyes sits on a wooden windowsill, looking at a sparrow on a branch outside. Morning sunlight streams through the window, casting warm light on the cat's fur. A white ceramic coffee mug with steam rising sits on the sill to the left." This is not a 10% improvement. It is a <strong>fundamentally different capability</strong> — from classification to description, from labels to language. Here is the 15-year technological evolution that made it possible.</p>

<h2>Phase 1: Convolutional Neural Networks (2012-2017) — The Feature Extraction Era</h2>

<p>CNNs process images through layers of convolution filters — small sliding windows that detect edges, textures, and patterns at increasing levels of abstraction. The first layer detects edges. The second layer detects shapes. The third layer detects object parts. The final layers detect complete objects. The CNN is a <strong>feature extractor</strong> — it converts an image into a compact mathematical representation that captures what is in the image.</p>

<p>CNNs were excellent at classification and object detection. They could label images and draw bounding boxes around objects. But they could not generate descriptions. The CNN produced a category, not a sentence. The leap from classification to description required combining CNNs with a different type of model — one that could generate language.</p>

<h2>Phase 2: CNN + RNN/LSTM (2015-2020) — The Image Captioning Era</h2>

<p>The breakthrough: use a CNN as the encoder (visual features → compact representation) and an RNN/LSTM as the decoder (compact representation → sentence). The model "translates" an image into a sentence, similar to how machine translation converts French to English. The CNN sees the image. The RNN describes what it sees.</p>

<p>This architecture produced the first AI image captions: "A cat sitting on a windowsill." The captions were single sentences, often generic, and sometimes wrong. But they were sentences — not just labels. The AI had crossed the boundary from classification to description.</p>

<p>The limitation: RNNs process information sequentially, one word at a time. They have limited memory for long-range dependencies. An RNN describing a complex scene might "forget" the first object it saw by the time it describes the last one. The description would be inconsistent — the cat is described as orange in the first sentence and gray in the third.</p>

<h2>Phase 3: Vision Transformers (2020-Present) — The Dense Understanding Era</h2>

<p>Transformers replaced RNNs in both language and vision. A Vision Transformer (ViT) processes an image by dividing it into patches — small squares like puzzle pieces — and processing all patches simultaneously using attention mechanisms. The attention mechanism allows every patch to "look at" every other patch, learning which parts of the image are related regardless of distance. The transformer sees the entire image at once, not sequentially.</p>

<p>Combined with large language models, Vision Transformers produce <strong>dense, detailed descriptions</strong>: "An orange tabby cat with green eyes and white chest fur sits on a dark wooden windowsill, its body angled toward a window. Outside, a small brown sparrow perches on a bare branch. The cat's ears are forward, its gaze fixed on the bird. Morning light from the window creates a warm glow on the left side of the cat's face. A white ceramic coffee mug with a red heart pattern sits on the sill, steam rising faintly. Through the window, a suburban backyard with a wooden fence and bare winter trees is visible."</p>

<p>The description captures: object attributes (orange tabby, green eyes, white chest), spatial relationships (on the windowsill, toward the window, outside), temporal state (ears forward, gaze fixed, steam rising), and contextual detail (suburban backyard, bare winter trees). This is not a label. It is not a caption. It is a <strong>visual understanding</strong> expressed in language. The AI sees the scene the way a human would describe it to someone who cannot see it.</p>

<h2>What Has Not Changed</h2>

<p>Despite 15 years of progress, AI image description still: cannot understand the <strong>meaning</strong> of a scene (why is the cat looking at the bird? Because it is a predator. The AI does not know this.), cannot describe <strong>emotional content</strong> (the scene feels peaceful because of the morning light — the AI describes the light, but does not feel the peace), and can be <strong>confidently wrong</strong> (the "coffee mug" might actually be a teacup — the AI guessed based on statistical patterns, not actual knowledge).</p>

<p>The trajectory from 2012 to 2026 is remarkable. The trajectory from 2026 to 2040 will be even more so. But the fundamental limitation remains: the AI sees pixels and patterns. It does not see meaning. The description is accurate. The understanding is absent. That gap is the next frontier.</p>`
  },
];

// Synchronous static accessors"""

content = content.replace(old, new_blogs)

with open(BLOG_FILE, "w", encoding="utf-8") as f:
    f.write(content)

print("AI station: 166->done.")