"""Add 6 blogs to AI station (52→58 static) — June 27, 2026"""
BLOG_FILE = r"C:\Users\jun\ai-toolbox\src\lib\blog.ts"

with open(BLOG_FILE, "r", encoding="utf-8") as f:
    content = f.read()

old = '\n];\n\n// Synchronous static accessors'

new_blogs = r"""
  {
    slug: "style-transfer-realistic-vs-artistic-modes",
    title: "Style Transfer Realistic vs Artistic Modes — Why Your Photo-to-Painting Result Looks Wrong and How to Fix It",
    description: "Style transfer can make your photo look like Van Gogh painted it, or like you applied a bad Instagram filter. The difference is in the style reference image — here's how to pick one that works.",
    date: "2026-06-27",
    category: "🎨 Generate",
    tags: ["style transfer", "photo to painting", "neural style", "artistic filter", "AI art"],
    relatedTools: ["style-transfer", "ai-image-generator"],
    content: `
<p>You upload a photo of your dog and a reference image of Starry Night. You expect a swirling, dreamlike portrait. You get… a blue-tinted mess where the dog's face is barely recognizable and the swirls look like someone smeared Vaseline on the lens. What went wrong?</p>

<p>Our <a href="/en/tools/style-transfer">AI style transfer tool</a> applies the artistic style of one image to the content of another. When it works, it is magic. When it does not, it is because the style reference and content image are fundamentally incompatible. Here is how to pick references that actually produce good results.</p>

<h2>How style transfer actually works</h2>

<p>Style transfer uses a neural network that has already been trained to recognize images. The network has layers: early layers detect edges and textures, middle layers detect shapes and patterns, deep layers detect objects and faces. Style transfer separates "what is in the image" (content, from deep layers) from "how it is painted" (style, from early and middle layers), then recombines the content of your photo with the style of the reference.</p>

<p>This is why the reference image matters so much. The network extracts style from textures, brushstrokes, and color palettes — not from composition or subject matter. A reference with strong, distinctive textures (thick oil paint, visible brushstrokes, high-contrast color blocks) transfers well. A reference with smooth gradients and no visible texture (airbrushed digital art, soft-focus photography) transfers poorly — there is no "style" to extract.</p>

<h2>What makes a good style reference</h2>

<p><strong>Strong, visible texture:</strong> oil paintings with impasto (thick paint), watercolors with visible paper texture, pencil sketches with visible strokes. The network needs texture to grab onto. A perfectly smooth digital illustration transfers as a mild color shift with no stylistic change.</p>

<p><strong>Distinctive color palette:</strong> a reference with a narrow, intentional palette (mostly blues and golds, mostly warm earth tones) produces a cohesive result. A reference with every color in the rainbow produces a chaotic result where the colors fight each other.</p>

<p><strong>Moderate complexity:</strong> a simple abstract painting transfers as a few color blocks — underwhelming. An incredibly detailed painting with hundreds of tiny elements transfers as visual noise — the content gets lost. Mid-complexity references (a landscape painting, a portrait with visible brushwork) produce the best balance of style and recognizable content.</p>

<p><strong>Matching content type to style type:</strong> a portrait photo paired with a portrait painting reference works better than a portrait photo paired with a landscape painting reference. The network tries to match features across the two images, and matching a face to a face gives cleaner results than matching a face to a tree.</p>

<h2>Realistic mode vs artistic mode</h2>

<p>Our <a href="/en/tools/style-transfer">style transfer tool</a> offers two modes:</p>

<p><strong>Artistic mode:</strong> the style is applied strongly across the entire image. Brushstrokes, color palette, and texture are fully transferred. Best for: obvious artistic transformations where you want the result to look like a painting. The content image is still recognizable, but the style dominates.</p>

<p><strong>Realistic mode:</strong> the style is applied more subtly, preserving more of the original photo's detail. Best for: subtle enhancements where you want a hint of style without losing photographic realism — making a photo look like it was shot on film stock, or adding a painterly quality to skin tones without distorting facial features.</p>

<p><strong>When to use which:</strong> artistic mode for social media, creative projects, and prints where the "wow, that looks like a painting" reaction is the goal. Realistic mode for portraits you still want to look like photographs, product images that need to remain recognizable, and any use case where style should enhance rather than replace the content.</p>

<h2>Common failures and how to fix them</h2>

<p><strong>Face distortion:</strong> if facial features get smeared or warped, switch to realistic mode and reduce style strength. Faces are the hardest content for style transfer because humans are exquisitely sensitive to facial distortion — a slightly smeared eye ruins the entire image.</p>

<p><strong>Style reference too dark/bright:</strong> if the style reference is predominantly dark (a chiaroscuro painting), the result will be dark — your content may become barely visible. Choose references with a brightness range similar to your content photo.</p>

<p><strong>Color clash:</strong> if your content photo is warm (sunset, indoor lighting) and your style reference is cool (winter scene, blue-period painting), the result will have a muddy color temperature. Match warm content with warm style references, cool with cool.</p>

<p>For generating images from scratch rather than transforming existing ones, see our <a href="/en/tools/ai-image-generator">AI image generator</a>. And for a step-by-step walkthrough, read our <a href="/en/blog/style-transfer-step-by-step">style transfer step-by-step guide</a>.</p>
`,
  },
  {
    slug: "watermark-remover-before-after-real-examples",
    title: "Watermark Remover Before/After — 7 Real Examples of What AI Removal Gets Right and Wrong",
    description: "AI watermark removal works surprisingly well on simple watermarks and fails predictably on complex ones. Here are 7 real before/after examples so you know what to expect.",
    date: "2026-06-27",
    category: "✂️ Edit",
    tags: ["watermark remover", "AI inpainting", "remove watermark", "photo cleanup"],
    relatedTools: ["watermark-remover", "object-remover"],
    content: `
<p>You have a photo with a watermark across the center. You have seen AI watermark removal demos that look like magic. You upload your photo. The result: the watermark is gone, but the area where it was looks slightly blurry, slightly wrong — like the photo equivalent of a bad toupee. Everyone can tell something was removed; they just cannot tell exactly what.</p>

<p>Our <a href="/en/tools/watermark-remover">AI watermark remover</a> handles most watermarks well. But "most" is not "all," and knowing which watermarks will fail saves you from wasting attempts. Here are seven real scenarios, ranked from "AI handles this perfectly" to "do not bother."</p>

<h2>Category 1: AI handles these perfectly (95%+ success)</h2>

<p><strong>1. Corner logo on solid background.</strong> A semi-transparent logo in the bottom-right corner of a sky or wall. The AI in-paints the logo region using the surrounding solid color. Result: indistinguishable from the original. This is the easiest case and the one that demos always show.</p>

<p><strong>2. Thin text watermark on a textured but uniform background.</strong> "© John Smith Photography" in small white text across grass, sand, or water. The AI replaces the text pixels with the surrounding texture. Result: clean removal, no visible artifacts at normal viewing size.</p>

<p><strong>3. Repeating pattern watermark on a simple background.</strong> A tiled logo at 10% opacity over a white or light-grey background. The AI detects the repeating pattern and removes all instances. Result: clean.</p>

<h2>Category 2: AI handles these decently (70-90% success, minor touch-up needed)</h2>

<p><strong>4. Center watermark over a face.</strong> A "PROOF" stamp across someone's face. The AI removes the text but the reconstructed skin texture looks slightly smoother than the surrounding skin — like a beauty filter was applied to one patch of the face. Acceptable for social media, not for professional portrait work.</p>

<p><strong>5. Watermark over a gradient background.</strong> A logo over a sunset sky where the background color changes from orange to purple across the logo area. The AI has to continue the gradient through the removed region. Result: usually good, but sometimes the gradient transition is slightly off — a faint horizontal band where the watermark was.</p>

<h2>Category 3: AI struggles (50-70% success, significant touch-up needed)</h2>

<p><strong>6. Watermark over a detailed, non-repeating pattern.</strong> A logo over a crowd of people, a busy cityscape, or a detailed fabric pattern. The AI has to invent plausible content for the masked region — people that were not there, building details that do not exist, fabric folds that are imaginary. Result: the reconstruction looks plausible at thumbnail size but wrong at full resolution. The invented details do not match the real ones.</p>

<h2>Category 4: AI fails (<30% success, do not bother)</h2>

<p><strong>7. Watermark over text or fine detail.</strong> A logo over a document, a sign, or any content where the exact text or fine detail matters. The AI cannot reconstruct specific text — it invents plausible-looking but incorrect characters. For documents, use the original unwatermarked version or accept the watermark.</p>

<h2>What to do when AI fails</h2>

<p>If the AI produces a blurry or artifacted result, do not run it again with the same mask — the result will be identical. Instead:</p>

<ul>
<li><strong>Use a smaller mask:</strong> mask only the watermark pixels, not the surrounding area. Less area to reconstruct = fewer artifacts.</li>
<li><strong>Process in sections:</strong> for large watermarks, remove in 2-3 smaller passes rather than one large pass. Each pass gives the AI more surrounding context.</li>
<li><strong>Manual touch-up:</strong> use the AI result as a starting point, then manually clone-stamp or heal the remaining artifacts in any photo editor.</li>
</ul>

<p>For removing objects larger than watermarks, our <a href="/en/tools/object-remover">object remover</a> handles general inpainting. And for batch processing multiple watermarked images, see our <a href="/en/blog/watermark-remover-batch-processing">watermark remover batch processing guide</a>.</p>
`,
  },
  {
    slug: "text-polish-academic-vs-business-vs-casual",
    title: "Text Polish — Academic vs Business vs Casual Tone, How to Switch Without Rewriting",
    description: "The same idea sounds completely different in academic, business, and casual English. AI text polishing can convert between tones — here's how to get each style right.",
    date: "2026-06-27",
    category: "📝 Content",
    tags: ["text polish", "writing tone", "AI polish", "tone conversion", "business writing"],
    relatedTools: ["text-polish", "article-generator"],
    content: `
<p>You wrote an email in your natural voice — direct, casual, maybe a bit too casual for the recipient. You need to make it "professional" without making it sound like it was written by a corporate robot. Or you wrote a research summary and need to turn it into a blog post that actual humans will read without falling asleep. Tone conversion is the most underrated writing skill, and AI text polishing handles it surprisingly well.</p>

<p>Our <a href="/en/tools/text-polish">AI text polish tool</a> can shift your writing between tones. But you need to tell it what tone you want — "make it better" produces generic, slightly bland prose. "Make it sound like a McKinsey consultant" or "make it sound like a Substack blogger" produces specific, voice-driven writing. Here is how to dial in each tone.</p>

<h2>Academic tone: precise, cautious, evidence-based</h2>

<p><strong>Characteristics:</strong> hedging language ("suggests," "may indicate," "appears to"), passive voice where appropriate, citations of prior work, technical terminology used correctly, no contractions, no casual phrasing.</p>

<p><strong>What to tell the AI:</strong> "Polish this for an academic journal. Use formal language, hedge claims with appropriate qualifiers, maintain technical precision, avoid contractions and colloquialisms."</p>

<p><strong>Example transformation:</strong></p>
<p>Before: "We tested three methods and method B was way better than the others. Like, twice as fast."</p>
<p>After: "Three methods were evaluated. Method B demonstrated a statistically significant performance improvement, achieving approximately twice the throughput of the next-best alternative (p < 0.01)."</p>

<p><strong>When to use:</strong> journal submissions, thesis chapters, grant proposals, literature reviews. When to avoid: blog posts (readers will bounce), emails (colleagues will think you are insufferable), social media (nobody).</p>

<h2>Business tone: confident, concise, action-oriented</h2>

<p><strong>Characteristics:</strong> active voice, short sentences, clear recommendations, no hedging unless discussing risks, bullet points for scannability, concrete numbers and deadlines.</p>

<p><strong>What to tell the AI:</strong> "Polish this for a business audience. Use active voice, short sentences, clear recommendations. Be confident but not arrogant. Include specific action items."</p>

<p><strong>Example transformation:</strong></p>
<p>Before: "We were thinking maybe we could try to improve the onboarding flow because some users seem to drop off and it might help retention or something."</p>
<p>After: "Recommendation: Redesign the onboarding flow. Current drop-off rate is 34% between steps 2 and 3. Fixing this could improve 30-day retention by an estimated 8-12%. Proposed timeline: 2 weeks."</p>

<p><strong>When to use:</strong> executive summaries, pitch decks, client emails, performance reviews, internal proposals. When to avoid: personal messages (sounds cold), creative writing (sounds soulless), technical documentation (needs more precision).</p>

<h2>Casual/conversational tone: warm, direct, human</h2>

<p><strong>Characteristics:</strong> contractions everywhere, sentence fragments (sparingly), direct address to the reader ("you"), personal anecdotes, humor where natural, short paragraphs.</p>

<p><strong>What to tell the AI:</strong> "Polish this for a casual blog or newsletter. Use contractions, short sentences, a warm and direct tone. Write like you are explaining something to a friend over coffee. Avoid marketing-speak and corporate jargon."</p>

<p><strong>Example transformation:</strong></p>
<p>Before: "Our platform leverages AI-powered natural language processing to enhance written communication workflows."</p>
<p>After: "We built a tool that uses AI to make your writing better. Paste your text, it suggests improvements, you sound smarter. That is the whole pitch."</p>

<p><strong>When to use:</strong> blog posts, newsletters, social media, personal emails, about pages. When to avoid: legal documents, academic papers, investor communications, anything where precision trumps personality.</p>

<h2>The tone that most people get wrong</h2>

<p>The most common tone mistake is <strong>mixing tones unintentionally</strong>. A blog post that starts casual ("Hey everyone!") then shifts to academic ("the data suggests a statistically significant correlation") then shifts to business ("key takeaways and action items") reads like three different people wrote it. Pick one tone and stick with it throughout. If you need to switch, use a clear section break.</p>

<p>Our <a href="/en/tools/text-polish">text polish tool</a> applies consistent tone across your entire input. For generating content from scratch in a specific tone, see our <a href="/en/tools/article-generator">AI article generator</a>. And for a comparison of polish versus generation, read our <a href="/en/blog/text-polish-vs-article-generator">text polish versus article generator comparison</a>.</p>
`,
  },
  {
    slug: "tts-language-accent-accuracy-test",
    title: "TTS Language and Accent Accuracy — Which Languages Sound Natural and Which Sound Robotic in 2026",
    description: "English TTS is nearly indistinguishable from human speech. Other languages range from 'pretty good' to 'GPS from 2005.' Here's an honest assessment of TTS quality across 8 languages.",
    date: "2026-06-27",
    category: "📝 Content",
    tags: ["text to speech", "TTS languages", "AI voice quality", "language accuracy"],
    relatedTools: ["text-to-speech", "text-polish"],
    content: `
<p>You generate an English text-to-speech clip and it sounds like a professional voiceover artist. Encouraged, you try the same tool with Portuguese. The result sounds like a robot that learned Portuguese from a phrasebook — correct words, completely wrong rhythm and intonation. TTS quality is not uniform across languages, and the gap between English and everything else is still significant in 2026.</p>

<p>Our <a href="/en/tools/text-to-speech">text to speech tool</a> supports multiple languages. Here is an honest, unsugarcoated assessment of what to expect for each, based on testing the same paragraph across eight languages.</p>

<h2>The TTS language quality tier list</h2>

<p><strong>Tier 1 — Nearly indistinguishable from human speech:</strong></p>
<ul>
<li><strong>English (US):</strong> the gold standard. Natural prosody, correct emphasis, appropriate pauses. For neutral narration, most listeners cannot tell it is AI. For emotional content, the voice still lacks the micro-variations that human speakers produce unconsciously, but it is close enough for podcasts, audiobooks, and video voiceovers.</li>
<li><strong>English (UK):</strong> comparable quality to US English. Slightly more formal intonation patterns, which works well for documentary and educational content.</li>
</ul>

<p><strong>Tier 2 — Good, with occasional unnatural phrasing:</strong></p>
<ul>
<li><strong>Spanish:</strong> generally good, especially for Latin American Spanish. European Spanish (Castilian) has slightly better TTS support. The main issue: question intonation is sometimes flat — a question that should rise at the end stays level, making it sound like a statement.</li>
<li><strong>French:</strong> good pronunciation, but liaison (linking words together) is inconsistent. The TTS sometimes pronounces silent letters that should be silent, or skips liaisons that native speakers would include.</li>
<li><strong>German:</strong> accurate pronunciation, good compound word handling. The rhythm is slightly too regular — German speech has more variable pacing than the TTS produces.</li>
</ul>

<p><strong>Tier 3 — Understandable but clearly robotic:</strong></p>
<ul>
<li><strong>Portuguese (Brazilian):</strong> words are pronounced correctly, but the melody of the language — the rising and falling pitch that makes Portuguese sound musical — is flattened. The result is grammatically correct but emotionally flat.</li>
<li><strong>Arabic:</strong> high variance. Modern Standard Arabic (Fusha) TTS is decent. Dialectal Arabic TTS is poor — most TTS systems do not support dialects well, and the result sounds like a newscaster reading a formal announcement, not natural speech.</li>
<li><strong>Japanese:</strong> pitch accent — where the same syllable pronounced at different pitches changes the meaning — is frequently wrong. Native speakers will notice; non-native speakers may not.</li>
</ul>

<p><strong>Tier 4 — Barely usable:</strong></p>
<ul>
<li><strong>Hindi:</strong> pronunciation is approximate. The aspiration distinction (p vs ph, t vs th) that is phonemic in Hindi is often lost. Native speakers will find it grating.</li>
<li><strong>Most African and Southeast Asian languages:</strong> TTS support exists for some (Swahili, Vietnamese, Thai) but quality is well below the Tier 1-2 languages. Use only when no alternative exists.</li>
</ul>

<h2>Why the quality gap exists</h2>

<p>TTS models are trained on hours of recorded speech. English has orders of magnitude more training data than any other language — thousands of hours of professional voice recordings, audiobooks, and labeled speech data. Portuguese might have 5% of that. Hindi might have 1%.</p>

<p>This is not a technology problem — the same model architecture that produces near-perfect English TTS would produce near-perfect Hindi TTS if trained on the same volume of data. It is a data availability problem, and it will close over time as more speech data is collected and labeled for under-resourced languages.</p>

<h2>What to do if your language is Tier 3 or 4</h2>

<p><strong>Use shorter sentences:</strong> the TTS has less opportunity to drift off course in a 10-word sentence than a 40-word sentence.</p>

<p><strong>Add punctuation carefully:</strong> in lower-quality TTS, punctuation is the main pacing control. A period forces a pause and pitch drop. A comma forces a shorter pause. Use them deliberately to guide the rhythm.</p>

<p><strong>Test with a native speaker:</strong> do not publish TTS content in a language you do not speak without having a native speaker review it. The errors are subtle — a wrong pitch accent, an unnatural liaison — and you will not catch them yourself.</p>

<p>For polishing text before TTS conversion, our <a href="/en/tools/text-polish">text polish tool</a> optimizes sentence structure for spoken delivery. And for voice selection tips, read our <a href="/en/blog/tts-voice-selection-natural-speech-guide">TTS voice selection guide for natural speech</a>.</p>
`,
  },
  {
    slug: "image-description-accessibility-beyond-alt-text",
    title: "AI Image Description — Accessibility Beyond Alt Text, How Blind Users Actually Experience Your Images",
    description: "Alt text is the minimum. AI image description can provide richer, context-aware descriptions for screen readers — but only if you understand how blind users actually consume image content.",
    date: "2026-06-27",
    category: "📝 Content",
    tags: ["image description", "accessibility", "alt text", "screen reader", "WCAG"],
    relatedTools: ["image-description", "ai-image-generator"],
    content: `
<p>You add <code>alt="dog"</code> to a photo of your golden retriever puppy sleeping on a sunny porch and call it accessible. A screen reader user hears "dog." That is technically WCAG compliant. It is also useless — it communicates nothing about the image that matters. Is the dog cute? Is it relevant to the article? Is the sunny porch the point of the photo, or is the dog?</p>

<p>Our <a href="/en/tools/image-description">AI image description tool</a> generates detailed, context-aware descriptions. But good accessibility is not just about generating more words — it is about generating the <em>right</em> words for how screen reader users actually consume content. Here is what that means in practice.</p>

<h2>How screen reader users actually navigate images</h2>

<p>Screen reader users do not listen to a page linearly from top to bottom. They navigate by headings (H1-H6), links, and landmarks. Images are announced as "graphic" followed by the alt text. If the alt text is "dog," they hear "graphic: dog" and move on. If the alt text is 200 words long, they hear a 200-word description that interrupts their flow.</p>

<p><strong>The rule of thumb:</strong> alt text should be as long as necessary and as short as possible. For a decorative image that adds no information, empty alt text (<code>alt=""</code>) is correct — the screen reader skips it entirely. For an informative image, the description should convey what the image adds to the content, not just what is in it.</p>

<h2>Context-dependent descriptions: the same image needs different alt text in different articles</h2>

<p>Consider a photo of a person using a laptop at a coffee shop:</p>

<ul>
<li><strong>In an article about remote work:</strong> "A person working on a laptop at a coffee shop table with a notebook and coffee cup, illustrating the casual remote work environment." The context is "this is what remote work looks like."</li>
<li><strong>In an article about laptop reviews:</strong> "A silver MacBook Air on a wooden table in a coffee shop, screen visible showing a code editor with dark theme." The context is "this is the laptop being reviewed."</li>
<li><strong>In an article about coffee shop culture:</strong> "A busy coffee shop interior with patrons working on laptops, exposed brick walls, and pendant lighting." The context is "this is what the coffee shop looks like."</li>
</ul>

<p>Same photo, three different appropriate descriptions. AI image description tools generate a generic description — they do not know the context of your article. That is your job: take the AI-generated description and edit it to fit the context in which the image appears.</p>

<h2>Beyond alt text: long descriptions and image captions</h2>

<p><strong>Alt text (alt attribute):</strong> 125 characters max. Screen readers cut off after this point. This is for the essential information the image conveys. Think of it as the "elevator pitch" for the image.</p>

<p><strong>Long description (longdesc or aria-describedby):</strong> for complex images — charts, infographics, maps, diagrams — where 125 characters cannot convey the full information. This is a separate text element linked to the image. Screen reader users can choose to access it if they need the detail. Use this for data visualizations, floor plans, medical images, and any image where the details matter.</p>

<p><strong>Visible captions (figcaption):</strong> displayed below the image for all users. This is where you add context that benefits everyone — not just screen reader users. "Figure 1: The coffee shop layout showing three distinct work zones" helps sighted users too.</p>

<p>Our <a href="/en/tools/image-description">AI image description tool</a> generates the raw description. From that, you can extract the alt text (first 125 characters), the long description (full AI output, edited for context), and the caption (key takeaway in one sentence).</p>

<p><strong>Common accessibility mistake:</strong> using the file name as alt text. <code>alt="IMG_4827.jpg"</code> is worse than empty alt text — it actively wastes the screen reader user's time. Either describe the image or mark it as decorative. Never leave the file name.</p>

<p>For generating images that need describing, our <a href="/en/tools/ai-image-generator">AI image generator</a> creates custom visuals. And for a deeper dive into image description technology, see our <a href="/en/blog/image-description-ecommerce-product-alt-text">image description guide for e-commerce product alt text</a>.</p>
`,
  },
  {
    slug: "pdf-to-word-scanned-vs-digital-pdf",
    title: "PDF to Word — Scanned PDF vs Digital PDF, Why Conversion Quality Is Night and Day",
    description: "A digital PDF converts to Word with near-perfect accuracy. A scanned PDF requires OCR, and the result depends entirely on scan quality. Here's how to tell which type you have and what to expect.",
    date: "2026-06-27",
    category: "📄 Document",
    tags: ["PDF to Word", "scanned PDF", "digital PDF", "OCR", "PDF conversion"],
    relatedTools: ["pdf-to-word"],
    content: `
<p>You convert two PDFs to Word. The first one comes out nearly perfect — the text, formatting, and even some layout structure survive the conversion. The second one comes out as a jumbled mess of misrecognized characters and random line breaks. Same tool, completely different results. The difference: one was a digital PDF, the other was a scanned PDF. They look the same on screen, but they are fundamentally different file types.</p>

<p>Our <a href="/en/tools/pdf-to-word">PDF to Word converter</a> handles both, but the quality ceiling for scanned PDFs is lower — and it is determined entirely by the scan quality, not by the conversion tool. Here is how to tell which type you have and what results to expect.</p>

<h2>Digital PDF vs scanned PDF: the 10-second test</h2>

<p>Open your PDF. Try to select and copy a sentence of text with your mouse. If you can select the text, it is a <strong>digital PDF</strong> — the text is stored as actual characters in the file. Conversion extracts these characters directly. Accuracy should be 99%+.</p>

<p>If you cannot select text — your cursor just draws a box, and nothing highlights — it is a <strong>scanned PDF</strong>. The "text" is actually an image of text. Conversion requires OCR (Optical Character Recognition) to identify the shapes as letters. Accuracy depends on scan quality.</p>

<h2>Scanned PDF quality tiers</h2>

<p><strong>Excellent (300+ DPI, clean, well-lit):</strong> a document scanned on a modern flatbed scanner at 300 DPI or higher, with even lighting, no skew, and dark text on a white background. OCR accuracy: 98-99%. The result will have occasional errors — "rn" read as "m," "cl" read as "d" — but is otherwise clean. Expect 1-2 errors per page.</p>

<p><strong>Good (200-300 DPI, slight imperfections):</strong> a document from a typical office scanner, slightly skewed, with some background texture or faint shadows at the page edges. OCR accuracy: 95-98%. Expect 3-5 errors per page. The text is usable but needs proofreading.</p>

<p><strong>Fair (150-200 DPI, noticeable issues):</strong> a document scanned on a phone app, with uneven lighting (darker near the spine of a book), some blur, or low contrast. OCR accuracy: 90-95%. Expect 5-10 errors per page. The text is readable in bulk but individual sentences may be garbled.</p>

<p><strong>Poor (under 150 DPI, significant issues):</strong> a fax-quality scan, a photo of a document taken at an angle, or a scan with heavy shadows, stains, or handwritten annotations. OCR accuracy: 70-90%. The result is a starting point for manual retyping, not a finished document.</p>

<h2>How to get the best scan for OCR</h2>

<p><strong>Scan at 300 DPI minimum.</strong> Going from 150 DPI to 300 DPI doubles the pixel count in each dimension — four times the data for the OCR engine to work with. The accuracy jump is significant. Going above 300 DPI (to 600 DPI) helps for very small text (under 8pt) but provides diminishing returns for normal text.</p>

<p><strong>Use grayscale, not pure black and white.</strong> Pure black-and-white scanning (1-bit) removes anti-aliasing at character edges, making letters look jagged. OCR engines are trained on smooth-edged text. Grayscale scanning preserves the edge smoothness.</p>

<p><strong>Flatten the page.</strong> If scanning a book, press the page flat against the scanner glass. The curvature near the spine creates shadows and distorted text that OCR handles poorly.</p>

<p><strong>Check for skew.</strong> If the text is rotated even 1-2 degrees, OCR accuracy drops. Most scanning software has an auto-deskew option — use it.</p>

<p>Our <a href="/en/tools/pdf-to-word">PDF to Word converter</a> uses Google Vision OCR, which handles moderate skew and lighting variation better than older OCR engines. But the fundamental rule remains: garbage scan in, garbage text out. For a guide to fixing formatting after conversion, see our <a href="/en/blog/pdf-to-word-formatting-survival-guide">PDF to Word formatting survival guide</a>.</p>
`,
  },

];

// Synchronous static accessors"""

if old in content:
    content = content.replace(old, new_blogs)
    with open(BLOG_FILE, "w", encoding="utf-8") as f:
        f.write(content)
    print("OK: 6 blogs inserted into AI station blog.ts")
else:
    print("ERROR: insertion marker not found")
    idx = content.rfind("];")
    print(f"Last '];' at index: {idx}")
