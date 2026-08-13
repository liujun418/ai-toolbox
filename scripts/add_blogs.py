"""Add 6 blogs to AI station (311→317 unique) — August 13, 2026"""
import os

BLOG_FILE = r"C:\Users\jun\ai-toolbox\src\lib\blog.ts"

with open(BLOG_FILE, "r", encoding="utf-8") as f:
    content = f.read()

old = '\n];\n\n// Synchronous static accessors'

new_blogs = r"""
  {
    slug: "pdf-to-word-non-latin-scripts-arabic-cjk",
    title: "PDF to Word for Arabic, Chinese, and Japanese How Non-Latin Scripts Survive Conversion",
    description: "A PDF with Arabic text converts to Word and the letters come out reversed or broken. Chinese characters turn into squares. Here's how non-Latin scripts survive PDF to Word conversion.",
    date: "2026-08-13",
    category: "Document",
    tags: ["pdf to word", "Arabic PDF", "CJK", "non-Latin scripts", "OCR"],
    relatedTools: ["pdf-to-word", "image-description", "text-polish"],
    content: `<p>Your client sends you a PDF with Arabic text. You run it through a <a href="/en/tools/pdf-to-word">PDF to Word converter</a>. The Word file comes back with the Arabic letters reversed and disconnected. You try a Chinese PDF. The characters render as empty boxes. The conversion failed not because the tool is bad, but because non-Latin scripts have rules that Latin text does not. Here is how Arabic, Chinese, and Japanese survive the trip.</p>

<h2>How Non-Latin Scripts Survive PDF to Word Conversion</h2>

<p><strong>Arabic and the RTL problem.</strong> Arabic is written right-to-left, and letters change shape depending on their position in a word — initial, medial, final, or isolated. A PDF stores the shaped, rendered glyphs. A converter that treats text as a simple left-to-right character stream breaks the order and drops the shaping. A good converter handles RTL direction and re-assembles the word correctly. The <a href="/en/tools/pdf-to-word">PDF to Word converter</a> preserves the RTL structure so the Word file reads naturally. <strong>Chinese, Japanese, and Korean — the embedding problem.</strong> CJK fonts are large, and PDFs often embed only a subset of the glyphs actually used. If a character is missing from the embedded subset, it shows as a box. The converter must map to a font that contains the full character set, or the text is lost. <strong>Scanned PDFs need OCR.</strong> If the PDF is a scan — not a text layer — every script needs OCR to become editable. The <a href="/en/tools/image-description">image description</a> tool handles visual understanding of the same kind of content. The <a href="/en/tools/text-polish">text polish</a> tool refines the converted text once it is editable. The <a href="/en/tools/pdf-to-word">PDF to Word converter</a> is the bridge. The script is the passenger. The result is a Word file that speaks the reader's language, correctly shaped and in the right direction.</p>`
  },
  {
    slug: "avatar-generator-artist-brands-illustrator-avatar",
    title: "How Illustrators and Brands Use AI Avatars Custom Character Avatars Beyond Selfies",
    description: "You need an avatar for your brand that is not your face — a mascot, an illustrated character, a stylized logo. AI avatar generators can create them. Here's how illustrators and brands adapt the workflow.",
    date: "2026-08-13",
    category: "Generate",
    tags: ["AI avatar", "brand mascot", "illustrator", "character design", "brand identity"],
    relatedTools: ["avatar-generator", "ai-image-generator", "style-transfer"],
    content: `<p>You run a podcast about cooking. Your profile picture is a generic microphone. You want an avatar that people recognize — not your face, but an illustrated chef character in a flat, friendly style. You open an <a href="/en/tools/avatar-generator">AI avatar generator</a>. But avatar tools are built for selfies: upload your photos, get portraits of you. How do you get a <strong>character</strong>, not a portrait? Here is how illustrators and brands adapt the workflow.</p>

<h2>How to Create a Brand or Character Avatar With AI</h2>

<p><strong>Step 1: Describe the character in the style.</strong> Most avatar tools let you choose a style preset — flat, cartoon, 3D, pixel. Pick the style that matches your brand, then describe the character in your prompt: "a cheerful female chef with a red apron and a toque." <strong>Step 2: Use a consistent reference.</strong> If the tool supports reference images, upload an existing mascot or logo so the AI keeps the same colors and shapes across outputs. <strong>Step 3: Generate variations.</strong> Create several versions — different poses, expressions, backgrounds. Pick the one that reads clearly at 32 pixels, because that is where your avatar lives on social profiles. <strong>Step 4: Refine with complementary tools.</strong> The <a href="/en/tools/style-transfer">style transfer</a> tool imposes a consistent artistic style across your generated characters. The <a href="/en/tools/ai-image-generator">AI image generator</a> expands a single character into scenes — the chef in the kitchen, the chef at the market. The <a href="/en/tools/avatar-generator">avatar generator</a> is the character factory. The brand guide is the consistency contract. The result is an avatar that is unmistakably yours.</p>`
  },
  {
    slug: "face-blur-rental-property-photos-airbnb",
    title: "Face Blur for Rental Property Photos How Hosts Protect Guest Privacy",
    description: "Your listing photos show the apartment — and the previous guest's family in the corner of a shot. You need to publish the photo without exposing people. Here's how hosts blur faces before publishing.",
    date: "2026-08-13",
    category: "Edit",
    tags: ["face blur", "rental property", "Airbnb", "guest privacy", "real estate"],
    relatedTools: ["face-blur", "object-remover", "background-remover"],
    content: `<p>You host a short-term rental. A guest leaves a review that mentions how the photos helped them choose the place. You take new photos of the apartment — the light is perfect, the kitchen looks great. But in the background of one shot, the previous guests are visible on the balcony. You cannot publish that photo without their consent. A <a href="/en/tools/face-blur">face blur</a> tool anonymizes the faces while keeping the photo publishable. Here is the host's workflow.</p>

<h2>How to Blur Faces in Rental Property Photos</h2>

<p><strong>Step 1: Scan every photo.</strong> Open the <a href="/en/tools/face-blur">face blur</a> tool and upload each photo. The AI detects faces automatically — including small faces in the background, faces behind glass, and partial faces at the edge of the frame. <strong>Step 2: Apply the blur to detected faces.</strong> Blur every detected face. The blur must be strong enough that the person is unidentifiable — a soft blur is not enough for privacy. <strong>Step 3: Handle identifiable non-faces.</strong> A face is not the only identifying feature. A distinctive tattoo, a recognizable jacket, or a license plate also identifies people. Use the <a href="/en/tools/object-remover">object remover</a> for those specific items. <strong>Step 4: Keep the room readable.</strong> The <a href="/en/tools/background-remover">background remover</a> can isolate the room itself if you want to crop the people out entirely. The <a href="/en/tools/face-blur">face blur</a> keeps the scene intact. The host is the responsible publisher. The result is a listing that shows the space without exposing the people who were in it.</p>`
  },
  {
    slug: "object-remover-restoring-old-photos-damage",
    title: "Restoring Old Damaged Photos With an Object Remover Scratches, Stains, and Tears",
    description: "Grandma's wedding photo has a crease across the center and a stain on the corner. You could send it to a restorer. Or you could clean the damage yourself. Here's how an object remover handles scratches and tears.",
    date: "2026-08-13",
    category: "Edit",
    tags: ["object remover", "photo restoration", "scratches", "tears", "old photos"],
    relatedTools: ["object-remover", "photo-restorer", "image-upscaler"],
    content: `<p>Your grandmother's wedding photo is 60 years old. It has a crease running across the middle, a brown stain in the corner, and a small tear at the edge. A professional restoration would cost money and take weeks. An <a href="/en/tools/object-remover">object remover</a> cleans the damage in minutes — if you use it the right way. Here is the workflow.</p>

<h2>How to Clean Scratches and Tears With an Object Remover</h2>

<p><strong>Step 1: Scan the photo at high resolution.</strong> Scan the print at 600 DPI or more. The AI needs detail to rebuild what is under the damage. <strong>Step 2: Brush the damage, not the face.</strong> Use the <a href="/en/tools/object-remover">object remover</a> and brush over the crease, the stain, and the tear — one region at a time. <strong>Step 3: Rebuild in passes.</strong> Long scratches may not clean in one pass. Re-run the brush over the residual line. The AI samples the surrounding texture — the fabric of the dress, the wall behind — and reconstructs the area. <strong>Step 4: Restore, then upscale.</strong> For the best result, run the cleaned image through the <a href="/en/tools/photo-restorer">photo restorer</a> to fix any remaining unevenness, then the <a href="/en/tools/image-upscaler">image upscaler</a> to increase the resolution for printing. The <a href="/en/tools/object-remover">object remover</a> is the cleanup pass. The restorer is the finish pass. The result is a family photo that looks closer to the day it was taken.</p>`
  },
  {
    slug: "text-polish-vs-article-generator-write-vs-refine",
    title: "AI Text Polish vs AI Article Generator Write From Scratch or Refine What You Have",
    description: "Blank page? An article generator writes from scratch. Drafted something? A text polisher refines it. Both are writing tools. One creates. One improves. Here's when each fits.",
    date: "2026-08-13",
    category: "Content",
    tags: ["text polish", "article generator", "AI writing", "write vs refine", "content workflow"],
    relatedTools: ["text-polish", "article-generator", "text-to-speech"],
    content: `<p>You have two different writing problems. On Monday, you stare at a blank page for a newsletter and have no first sentence. On Tuesday, you finish a draft for a client and know it needs tightening, but you are too close to see the problems. The blank page needs an <a href="/en/tools/article-generator">AI article generator</a>. The draft needs an <a href="/en/tools/text-polish">AI text polish</a>. Same family of tools. Different jobs.</p>

<h2>Article Generator vs Text Polish: Create vs Refine</h2>

<p><strong>The article generator creates.</strong> You give it a topic, an outline, or a set of points, and it produces new prose from scratch. It is for the <strong>blank page</strong> — when nothing exists yet and you need a first draft. The <a href="/en/tools/article-generator">article generator</a> handles structure, length, and tone in one pass. <strong>The text polisher refines.</strong> You give it text that already exists — your draft, your notes, a previous version — and it improves it: grammar, clarity, sentence length, tone. It is for the <strong>working draft</strong>, when the ideas are down but the prose needs editing. The <a href="/en/tools/text-polish">text polish</a> tool keeps your voice and your content while making it read better. <strong>They complement each other.</strong> Generate a first draft with the article generator, then polish it with the text polisher — the two-step pipeline produces better text than either alone. Listen to the result with <a href="/en/tools/text-to-speech">text to speech</a> to catch awkward phrasing your eyes skip. The generator answers "how do I start?" The polisher answers "how do I make this better?" Start with one. Finish with the other.</p>`
  },
  {
    slug: "watermark-history-signatures-to-digital-marks",
    title: "Watermark History From Paper Mills to Digital Rights The Mark That Never Left",
    description: "Watermarks are not a digital invention. Paper makers stamped them in the 13th century to mark their mills. Today AI removes them and creators embed them. Here's the story of the watermark.",
    date: "2026-08-13",
    category: "Edit",
    tags: ["watermark history", "digital rights", "paper watermark", "copyright", "provenance"],
    relatedTools: ["watermark-remover", "image-description", "photo-restorer"],
    content: `<p>You download a stock photo and it has a faint logo in the corner — a <strong>watermark</strong>. You know it marks the owner and the license. What you may not know: the watermark is 700 years old. Paper makers in 13th-century Italy pressed symbols into their paper to identify the mill that made it. The mark was visible when held to light — literally "made by water." An <a href="/en/tools/watermark-remover">AI watermark remover</a> now removes marks; the watermark itself has a long history. Here is the story.</p>

<h2>The History of the Watermark</h2>

<p><strong>1282: the first paper watermark.</strong> A paper maker in Fabriano, Italy, pressed a symbol into the paper mold. When the sheet was held up to light, the symbol appeared — thinner paper where the wire was pressed. It identified the mill, the quality, and the maker. The watermark was a <strong>brand</strong> long before brands existed. <strong>400 years of trade marks.</strong> Paper mills across Europe used watermarks to prove provenance and quality. A buyer could verify the paper came from a reputable mill. <strong>The digital turn.</strong> When photos, documents, and media went digital, the watermark followed. A digital watermark is information embedded in a file — a logo over a photo, a pattern in a document — to mark ownership. <strong>The arms race.</strong> Creators embed watermarks to protect work; the <a href="/en/tools/watermark-remover">AI watermark remover</a> removes them when you have the right to the content. The <a href="/en/tools/image-description">image description</a> tool reads what a marked image actually shows. The <a href="/en/tools/photo-restorer">photo restorer</a> handles the surrounding damage. The watermark began as a mill's signature in paper. It survives as a creator's mark in pixels. Seven centuries of provenance, still doing the same job.</p>`
  },
];

// Synchronous static accessors"""

content = content.replace(old, new_blogs)

with open(BLOG_FILE, "w", encoding="utf-8") as f:
    f.write(content)

print("AI station: 311->317 unique done.")
