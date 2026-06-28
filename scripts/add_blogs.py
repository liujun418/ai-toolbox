"""Add 6 blogs to AI station (58→64 static) — June 28, 2026"""
BLOG_FILE = r"C:\Users\jun\ai-toolbox\src\lib\blog.ts"

with open(BLOG_FILE, "r", encoding="utf-8") as f:
    content = f.read()

old = '\n];\n\n// Synchronous static accessors'

new_blogs = r"""
  {
    slug: "bg-remover-social-media-platform-sizes",
    title: "Background Remover for Social Media — Platform-Specific Image Sizes, Aspect Ratios, and Why One Size Does Not Fit All",
    description: "A transparent background product photo that looks perfect on your website breaks on Instagram (1:1 crop), Twitter (16:9 header), and LinkedIn (banner dimensions). Here's how to prep one image for every platform.",
    date: "2026-06-28",
    category: "✂️ Edit",
    tags: ["background remover", "social media images", "platform sizes", "product photography", "transparent background"],
    relatedTools: ["background-remover", "image-upscaler"],
    content: `
<p>You remove the background from a product photo. It looks great — clean edges, transparent background, ready to place on any color. You upload it to your Instagram shop. Instagram crops it to 1:1 and cuts off the edges of your product. You upload it as a Facebook ad. Facebook stretches it to 1.91:1 and your product looks squashed. You upload it as an Amazon listing. Amazon requires a pure white background — and your transparent PNG renders with a black background on their viewer. The background removal was perfect. The platform-specific preparation was missing.</p>

<p>Our <a href="/en/tools/background-remover">AI background remover</a> extracts subjects with clean edges. But a transparent PNG is a starting point, not a finished asset. Here is how to adapt one background-removed image for every major platform without redoing the work.</p>

<h2>The platform dimension cheat sheet</h2>

<p><strong>Instagram:</strong> square posts are 1080×1080 (1:1). Portrait is 1080×1350 (4:5). Stories are 1080×1920 (9:16). For product photos, the square format is safest — it does not crop unexpectedly and works in both the grid and the feed. If your background-removed subject is horizontal (a wide product shot), add padding above and below to fill the 1:1 frame rather than cropping the product.</p>

<p><strong>Facebook / Meta Ads:</strong> feed ads recommend 1080×1080 (1:1) or 1200×628 (1.91:1). The 1:1 format works across Facebook, Instagram, and Messenger with one asset. The 1.91:1 format is better for link ads with text overlay. For background-removed product images, place the product on a branded color background at 1:1 — it stands out more than a white-background product shot in the noisy feed.</p>

<p><strong>Amazon / eBay / Etsy:</strong> Amazon requires pure white background (RGB 255,255,255) for the main product image — transparent PNGs are not accepted. The image must fill at least 85% of the frame. Minimum 1000px on the longest side for zoom functionality. After removing the background, place the product on a pure white canvas and export as JPEG (not PNG) for marketplace compliance.</p>

<p><strong>LinkedIn:</strong> company page cover is 1128×191 (yes, that narrow). Personal profile background is 1584×396. These are extreme aspect ratios — your background-removed subject will be a small element in a wide composition. Place the subject on one side, add text or brand elements on the other, and export at the exact dimensions.</p>

<p><strong>Twitter / X:</strong> header is 1500×500 (3:1). In-stream images display at 16:9 (1200×675) on desktop, cropped to center on mobile. For background-removed images in tweets, 16:9 with the subject centered is the safest format — it survives cropping on any device.</p>

<h2>The one-image, multi-platform workflow</h2>

<p><strong>Step 1:</strong> Remove the background with our <a href="/en/tools/background-remover">AI background remover</a>. Export the subject as a transparent PNG at the highest resolution available.</p>

<p><strong>Step 2:</strong> Create a platform-specific canvas at the target dimensions. Place the subject on a background color that matches your brand (or pure white for marketplaces). Position the subject with adequate padding — at least 10% of the canvas width/height on all sides.</p>

<p><strong>Step 3:</strong> For low-resolution source images, upscale before placing on large canvases. Our <a href="/en/tools/image-upscaler">AI image upscaler</a> increases resolution without visible quality loss — a 500px product shot upscaled to 2000px can fill a LinkedIn banner without pixelation.</p>

<p><strong>Step 4:</strong> Export at the platform's exact dimensions. Do not rely on the platform to resize — their compression algorithms vary, and a slightly wrong aspect ratio gets cropped in ways you cannot control.</p>

<p>For more creative uses of background removal beyond product photos, see our <a href="/en/blog/7-uses-for-bg-remover-beyond-products">7 uses for background remover beyond products guide</a>.</p>
`,
  },
  {
    slug: "photo-restorer-old-family-photos-guide",
    title: "Photo Restorer — How to Restore Old Family Photos Without Making Them Look AI-Generated",
    description: "AI photo restoration can fix scratches, fade, and tears in seconds. But over-processed restorations look waxy and fake. Here's how to restore old photos while keeping them looking like real photographs.",
    date: "2026-06-28",
    category: "✂️ Edit",
    tags: ["photo restoration", "old photos", "family photos", "AI photo repair", "photo restorer"],
    relatedTools: ["photo-restorer", "colorizer", "image-upscaler"],
    content: `
<p>You scan your grandmother's wedding photo from 1952. It is faded, scratched, and has a crease across the bottom right corner. You run it through an AI photo restorer. The scratches are gone. The fade is corrected. But your grandmother's face looks… wrong. The skin is too smooth — like a beauty filter was applied. The eyes are slightly too sharp. The photo went from "old but real" to "AI-generated and uncanny." The restoration fixed the damage but erased the photograph.</p>

<p>Our <a href="/en/tools/photo-restorer">AI photo restorer</a> fixes scratches, fade, and noise. But the difference between a good restoration and an uncanny one is knowing when to stop. Here is how to restore old photos while preserving what makes them feel like real photographs.</p>

<h2>Why over-restored photos look wrong</h2>

<p>The uncanny valley of photo restoration happens when the AI does too much. It removes not just damage but also the film grain, the slight soft focus of vintage lenses, the natural texture of skin and fabric. The result is technically "clean" but visually wrong — it looks like a CGI render of the original photo, not the original photo repaired.</p>

<p><strong>The root cause:</strong> AI restoration models are trained to produce "perfect" images. They learn that skin should be smooth, edges should be sharp, colors should be vibrant. But a 1952 photograph was shot on film with a manual-focus lens. It was never perfectly sharp. The slight softness is authentic to the era and the medium. Removing it removes the photograph's identity.</p>

<p><strong>The fix:</strong> restore in layers. Fix the damage (scratches, tears, stains) aggressively. Fix the aging (fade, yellowing, low contrast) moderately. Do not touch the original image character (film grain, lens softness, period-accurate color palette) at all. Think of restoration as repairing damage, not "improving" the photo.</p>

<h2>The three-pass restoration method</h2>

<p><strong>Pass 1 — Structural repair (aggressive):</strong> fix the physical damage. Scratches, creases, tears, missing corners, dust spots. This is what AI restoration does best — it fills damaged areas with plausible content from surrounding pixels. Be aggressive here. A scratch across a face needs to be completely gone, not partially faded.</p>

<p><strong>Pass 2 — Color and tone correction (moderate):</strong> correct the fade and color shift. Old color photos develop a red or yellow cast. Black and white photos lose contrast and develop a brownish sepia tone from chemical decay. Correct the color balance to neutral, but do not boost saturation to modern levels — a 1950s photo should not have 2020s color vibrancy.</p>

<p><strong>Pass 3 — Optional colorization (conservative):</strong> if colorizing a black and white photo with our <a href="/en/tools/colorizer">AI colorizer</a>, accept that the colors are plausible guesses, not historically accurate. Skin tones, clothing colors, and background elements are the AI's best estimate based on training data. Label colorized photos as "AI colorized" — do not present them as original color photographs.</p>

<h2>When to stop: the authenticity test</h2>

<p>After each restoration pass, ask: "If I showed this to the person in the photo (or someone who knew them), would they say 'that looks like the original, just cleaner' or 'that looks different'?" If the answer is "different," you have gone too far. Back up one pass.</p>

<p><strong>Specific signs of over-restoration:</strong></p>
<ul>
<li>Skin that looks airbrushed or plastic-like — the AI smoothed out pores and texture</li>
<li>Eyes that look hyper-sharp compared to the rest of the face — the AI sharpened irises but not cheeks</li>
<li>Hair that looks painted rather than photographed — individual strands became solid blocks</li>
<li>Teeth that are unnaturally white — the AI "corrected" natural tooth color to pure white</li>
<li>Background elements that look invented — the AI hallucinated details in blurry background areas</li>
</ul>

<p>For upscaling restored photos for printing, our <a href="/en/tools/image-upscaler">AI image upscaler</a> increases resolution without introducing new artifacts. And for a guide to prioritizing which photos to restore first, read our <a href="/en/blog/photo-restorer-triage-before-after">photo restorer triage before and after guide</a>.</p>
`,
  },
  {
    slug: "avatar-generator-corporate-creative-social",
    title: "AI Avatar Generator — Corporate Headshot vs Creative Portrait vs Social Media Avatar, What to Ask For in Each Mode",
    description: "'Generate a professional avatar' means completely different things on LinkedIn, Discord, and your company's About page. Here's how to prompt for each context and what 'professional' actually looks like on each platform.",
    date: "2026-06-28",
    category: "🎨 Generate",
    tags: ["AI avatar", "corporate headshot", "creative portrait", "social media avatar", "profile picture"],
    relatedTools: ["avatar-generator", "ai-image-generator", "style-transfer"],
    content: `
<p>You need a profile picture. You open an AI avatar generator and type "professional headshot." The result: a person in a suit against a blurred office background, looking directly at the camera with a slight smile. It is technically correct. It is also indistinguishable from every other AI-generated headshot on LinkedIn — the same suit, the same background, the same smile. It says "I used AI" more loudly than it says "I am professional."</p>

<p>Our <a href="/en/tools/avatar-generator">AI avatar generator</a> creates portraits from your photos. But the prompt matters more than the tool. "Professional" means different things on LinkedIn (conservative, approachable, competent), Discord (personality, interests, vibe), and your company's About page (on-brand, consistent with team photos). Here is how to prompt for each context.</p>

<h2>Corporate headshot (LinkedIn, company website, conference badge)</h2>

<p><strong>What "professional" means here:</strong> competent, approachable, trustworthy. The photo should say "you can hire this person" or "you can trust this person with your project." It should not say "look at my creative lighting" or "I am breaking the mold."</p>

<p><strong>Prompt structure:</strong> "Professional corporate headshot, [your characteristics], solid [color] background or softly blurred office, even studio lighting, looking at camera, slight natural smile, business attire, 85mm portrait lens look, shallow depth of field, clean and polished but not airbrushed."</p>

<p><strong>What to avoid:</strong> dramatic lighting (says "actor headshot," not "professional"), busy backgrounds (distracting), casual clothing (unless your industry is casual), heavy retouching (uncanny valley), props (coffee cups, laptops — these look staged).</p>

<p><strong>The specific details that matter:</strong> collar style (open collar = approachable, tie = formal), background color (grey = neutral, blue = tech, white = corporate), shoulder position (straight-on = confident, slight angle = approachable). These small choices communicate more about your professional identity than the AI model choice.</p>

<h2>Creative portrait (personal brand, portfolio, artistic projects)</h2>

<p><strong>What "creative" means here:</strong> personality, style, distinctiveness. The photo should be memorable — someone scrolling through 50 profiles should pause on yours. It can break rules that the corporate headshot must follow.</p>

<p><strong>Prompt structure:</strong> "Creative portrait, [your characteristics], [lighting style — neon, golden hour, dramatic side light, colored gel], [background — textured wall, urban, abstract], [artistic reference — editorial photography, film noir, vaporwave aesthetic], expressive, stylized but still clearly a portrait."</p>

<p><strong>What works:</strong> bold color choices, interesting lighting, unconventional compositions, artistic references. A creative portrait inspired by a specific photographer's style communicates taste and visual literacy.</p>

<p><strong>What fails:</strong> too much style obscuring the subject (if people cannot tell what you look like, it is not a portrait), clashing aesthetics (neon + vintage + minimalist all at once), overused AI tropes (cyberpunk, synthwave — these were fresh in 2023 and are clichés in 2026).</p>

<h2>Social media avatar (Discord, Twitter, gaming, forums)</h2>

<p><strong>What "good avatar" means here:</strong> recognizable at 48×48 pixels, expresses personality or interests, works in both light and dark mode. The photo will be seen at thumbnail size 90% of the time — detail is wasted.</p>

<p><strong>Prompt structure:</strong> "Social media avatar, [your characteristics], [style — illustrated, stylized photo, flat art, cartoon], simple composition, strong silhouette, works at small sizes, [color palette], clear facial features, circular crop ready."</p>

<p><strong>The small-size test:</strong> after generating, resize to 128×128 pixels. Can you still tell what it is? Can you still recognize the face? If the answer is no, the composition is too complex. A good avatar has one clear subject, high contrast between subject and background, and minimal fine detail.</p>

<p><strong>The dark mode test:</strong> view the avatar on both white and black backgrounds. Transparent-background avatars disappear on dark mode if the subject is dark. Add a subtle outline or choose a subject brightness that works on both.</p>

<p>For generating creative reference images to use as style guides, our <a href="/en/tools/ai-image-generator">AI image generator</a> creates custom style references. For applying an artistic style to an existing photo, see our <a href="/en/tools/style-transfer">style transfer tool</a>. And for a comparison of realistic vs stylized avatar approaches, read our <a href="/en/blog/avatar-generator-realistic-vs-stylized">avatar generator realistic vs stylized guide</a>.</p>
`,
  },
  {
    slug: "image-upscaler-large-format-printing-guide",
    title: "Image Upscaler — How to Enlarge Photos for Posters, Canvas Prints, and Large Format Without Visible Pixelation",
    description: "A 1200px photo looks sharp on screen. Printed at 24×36 inches, it becomes a pixelated mess. AI upscaling can bridge the gap — but only if you understand DPI, viewing distance, and what 'good enough' means for print.",
    date: "2026-06-28",
    category: "✂️ Edit",
    tags: ["image upscaler", "large format printing", "DPI", "photo enlargement", "print resolution"],
    relatedTools: ["image-upscaler", "ai-image-generator"],
    content: `
<p>You have a beautiful photo from your phone — 4000×3000 pixels, looks incredible on your 6-inch screen. You want it as a 24×36-inch canvas print for your living room wall. You upload it to the print service. They email back: "Image resolution too low for this print size. Minimum 300 DPI required." Your 12-megapixel photo is not enough for a large print. This surprises everyone the first time.</p>

<p>Our <a href="/en/tools/image-upscaler">AI image upscaler</a> increases resolution by 2× or 4×, adding plausible detail that was not in the original. Here is how to calculate what resolution you actually need for print, how AI upscaling fills in the missing pixels, and when to accept that a photo just will not work at poster size.</p>

<h2>The math that determines print size</h2>

<p><strong>The formula:</strong> print size in inches × DPI = required pixels.</p>

<p>A 24×36-inch print at 300 DPI requires 7200×10800 pixels — that is 78 megapixels. Your phone's 12MP photo (4000×3000) at 300 DPI gives you 13.3×10 inches. That is a nice desk print, not a wall print.</p>

<p><strong>But DPI requirements depend on viewing distance:</strong></p>
<ul>
<li><strong>300 DPI:</strong> viewed from 1-2 feet away — books, magazines, desk prints. The eye can resolve individual pixels at this distance, so you need high pixel density.</li>
<li><strong>200 DPI:</strong> viewed from 2-4 feet — wall art in a hallway, small posters. At arm's length plus a step back, the eye resolves less detail.</li>
<li><strong>150 DPI:</strong> viewed from 4-6 feet — large posters, wall art above a sofa. The eye cannot resolve 300 DPI at this distance; 150 DPI looks identical.</li>
<li><strong>100 DPI:</strong> viewed from 6+ feet — billboards, banners, trade show displays. Billboards are routinely printed at 15-30 DPI because the viewing distance is 50+ feet.</li>
</ul>

<p><strong>The practical upscaling math:</strong> your 4000×3000 photo at 150 DPI gives you a 26.7×20-inch print. A 2× AI upscale to 8000×6000 gives you 53.3×40 inches at 150 DPI — more than enough for a 24×36 canvas viewed from 4 feet away. The 2× upscale bridges the gap between phone photo and wall art.</p>

<h2>What AI upscaling actually adds (and what it cannot add)</h2>

<p><strong>What AI upscaling adds:</strong> edge sharpness, texture detail, and noise reduction. The AI looks at a blurry edge and makes it sharp. It looks at a smooth area with compression artifacts and cleans it up. It looks at low-resolution texture (grass, fabric, skin) and generates higher-resolution texture that looks plausible.</p>

<p><strong>What AI upscaling cannot add:</strong> information that was never in the photo. If a face is 50 pixels wide in the original, the AI cannot reconstruct the person's exact facial features at 200 pixels wide. It generates a plausible face based on the 50 pixels of data — but it is an AI's best guess, not the actual face. For group photos where individual faces matter, upscaling will disappoint. For landscapes, architecture, and photos where fine detail is texture rather than identity, upscaling works well.</p>

<p><strong>The 4× trap:</strong> a 4× upscale sounds better than 2×, but it is generating 16× more pixels (4× in each dimension). The AI has to invent proportionally more detail. For most photos, 2× upscale produces natural-looking results; 4× upscale often produces visible AI artifacts — repeating patterns, smoothed-out texture, unnatural sharpness in areas that should be soft. Start with 2×. If you need more, upscale 2×, review, then upscale 2× again — the intermediate human review catches artifacts before they compound.</p>

<h2>When to give up and use a different photo</h2>

<p>If your source photo is under 1000px on the longest side, no amount of AI upscaling will produce a good 24×36 print. The AI is generating more invented content than original content. The result will look like an AI-generated image that vaguely resembles your photo — not your photo enlarged.</p>

<p><strong>The minimum source resolution rule:</strong> the final print resolution should be no more than 4× your source resolution. If your source is 2000px wide, your final print should be no wider than 8000px — about 27 inches at 300 DPI or 53 inches at 150 DPI. Beyond 4×, AI artifacts dominate real detail.</p>

<p>For generating high-resolution images from scratch (no source photo needed), our <a href="/en/tools/ai-image-generator">AI image generator</a> creates images at printable resolutions directly. And for a reality check on upscaling claims, read our <a href="/en/blog/image-upscaler-480p-to-4k-reality-check">image upscaler 480p to 4K reality check</a>.</p>
`,
  },
  {
    slug: "ai-colorizer-vs-hand-colorization",
    title: "AI Colorizer vs Hand Colorization — Speed vs Accuracy, When 30 Seconds of AI Beats 3 Hours of Manual Work",
    description: "Hand-colorizing a black and white photo in Photoshop takes hours and produces historically plausible results. AI colorization takes 30 seconds and produces visually pleasing guesses. Here's when each approach wins.",
    date: "2026-06-28",
    category: "✂️ Edit",
    tags: ["AI colorizer", "hand colorization", "photo colorization", "black and white to color", "color restoration"],
    relatedTools: ["colorizer", "photo-restorer"],
    content: `
<p>You have a black and white photo of your grandfather in his military uniform from 1943. You want to see it in color. You have two options: spend 3 hours in Photoshop manually painting every element with historically researched colors, or run it through an AI colorizer in 30 seconds and accept whatever colors the AI guesses. The AI result will look visually pleasing. The hand-colored result will be historically accurate. Which matters more depends entirely on what the photo is for.</p>

<p>Our <a href="/en/tools/colorizer">AI colorizer</a> adds color to black and white photos in seconds. Here is the honest comparison: when AI colorization is good enough, when only manual colorization will do, and how to combine both for the best result.</p>

<h2>What AI colorization gets right</h2>

<p><strong>Skies, grass, trees, and water:</strong> these are nearly always correct. Sky is blue, grass is green, tree trunks are brown, water reflects blue-green. The AI has seen millions of examples and rarely makes mistakes on natural elements.</p>

<p><strong>Skin tones:</strong> generally accurate for the overall skin color. The AI recognizes faces and applies a plausible skin tone range. It may not match the person's exact complexion — it picks the most common skin tone for the lighting conditions — but the result looks human and natural.</p>

<p><strong>Common clothing:</strong> suits, dresses, uniforms in common colors. A dark suit becomes navy or charcoal. A light dress becomes white or cream. The AI picks the most statistically likely color, which is usually close enough for casual viewing.</p>

<p><strong>Overall color harmony:</strong> AI colorization produces visually coherent images. The colors work together — no neon green grass next to purple skin. The AI learns color harmony from its training data of real color photographs.</p>

<h2>What AI colorization gets wrong</h2>

<p><strong>Specific uniform and insignia colors:</strong> a military uniform from 1943 has specific, documented colors — olive drab for US Army, field grey for German, khaki for British tropical. The AI does not know which uniform it is looking at and guesses. For military, historical, or ceremonial photos where uniform color carries meaning, AI colorization is not reliable.</p>

<p><strong>Product and brand colors:</strong> a 1960s Coca-Cola sign in black and white. The AI might make the sign red (correct) or blue (wrong). It does not know brand identities. For photos where specific colors matter (branded items, flags, logos), the AI is guessing.</p>

<p><strong>Rare or unusual objects:</strong> a specific car model in a specific factory color, a building with distinctive paint, a piece of art in the background. The AI has no context for these and picks the most common color for similar shapes — which is often wrong.</p>

<p><strong>Color bleeding:</strong> colors from one object "bleed" into adjacent objects. A red dress colors the arm next to it slightly red. A green background tints the edge of a face slightly green. These artifacts are subtle but noticeable on close inspection.</p>

<h2>When to use which approach</h2>

<p><strong>AI colorization wins when:</strong></p>
<ul>
<li>The photo is for personal use — sharing with family, social media, a casual gift. AI colorization is "good enough" and takes 30 seconds.</li>
<li>The photo has mostly natural elements — landscapes, outdoor portraits, nature scenes. The AI rarely makes noticeable mistakes on these.</li>
<li>You have many photos to colorize — a shoebox of 100 family photos. 30 seconds each = 50 minutes total. Hand-coloring 100 photos at 3 hours each = 300 hours. AI wins on volume.</li>
</ul>

<p><strong>Hand colorization wins when:</strong></p>
<ul>
<li>The photo has historical or documentary value — a museum piece, a publication, a historical record. Accuracy matters more than speed.</li>
<li>The photo contains specific identifiable colors — uniforms, flags, branded products, known artworks. These should be researched, not guessed.</li>
<li>The photo will be printed large — 16×20 or bigger. AI colorization artifacts (color bleeding, flat tones) are visible at large print sizes.</li>
</ul>

<p><strong>The hybrid approach (best of both):</strong> run AI colorization first. It handles skies, skin, grass, and overall color balance in 30 seconds. Then manually correct the 5-10% of elements the AI got wrong — the uniform, the sign, the specific car color. This gives you 90% AI speed with 100% manual accuracy on the elements that matter. 30 seconds of AI + 30 minutes of touch-up beats 3 hours of full manual colorization.</p>

<p>For fixing damage before colorizing (scratches and fade interfere with AI color detection), our <a href="/en/tools/photo-restorer">photo restorer</a> cleans up old photos. And for a guide to the correct order of restoration operations, read our <a href="/en/blog/colorizer-vs-restorer-pipeline-order">colorizer vs restorer pipeline order guide</a>.</p>
`,
  },
  {
    slug: "object-remover-ethics-boundaries",
    title: "Object Remover Ethics — When Removing Something from a Photo Crosses the Line from Editing to Deception",
    description: "Removing a trash can from a vacation photo is editing. Removing a person from a protest photo is deception. Where is the line? Here's a framework for deciding when object removal is ethically fine and when it is not.",
    date: "2026-06-28",
    category: "✂️ Edit",
    tags: ["object remover", "photo ethics", "image manipulation", "photo authenticity", "AI editing ethics"],
    relatedTools: ["object-remover", "watermark-remover", "background-remover"],
    content: `
<p>You take a photo of a beautiful sunset at the beach. There is a plastic bottle in the sand in the foreground. You remove it with an AI object remover. The photo now shows pristine nature. Is this ethically fine? Most people say yes — the bottle was not the subject, removing it does not change the meaning of the photo, and nobody is being deceived about anything important.</p>

<p>Now: you take a photo of a political protest. You remove the counter-protesters from the background. The photo now shows one-sided support for the cause. Is this ethically fine? Most people say no — you have changed the meaning of the photo from "there were people on both sides" to "everyone supported this." That is not editing; it is fabrication.</p>

<p>Our <a href="/en/tools/object-remover">AI object remover</a> makes removing objects trivially easy. The technical capability has raced ahead of the ethical conversation. Here is a framework for deciding when object removal is editing and when it is deception.</p>

<h2>The three-question ethics test</h2>

<p>Before removing any object from a photo, ask three questions:</p>

<p><strong>1. Does the removal change the meaning of the photo?</strong> Removing a distracting background element (a trash can, a random stranger, a power line) does not change what the photo is about. Removing a person from a group, a sign from a protest, or damage from a product photo changes what the photo communicates. If the removal alters the story the photo tells, it is no longer the same photo — it is a new image that looks like the original.</p>

<p><strong>2. Would someone reasonably feel deceived if they saw the original?</strong> If you show the edited photo to someone who was there, would they say "that is not what it looked like"? If yes, the edit is deceptive. A vacation photo with a trash can removed — the person who was there would not notice or care. A protest photo with counter-protesters removed — anyone who was there would immediately call it fake.</p>

<p><strong>3. Is the photo being presented as documentary evidence or artistic expression?</strong> Documentary photos (journalism, legal evidence, scientific records, historical documentation) should never be altered in ways that change their factual content. Artistic photos (fine art, creative portfolios, personal social media) have more latitude — but should still be disclosed if the manipulation is significant. "This is art" is not a blanket exemption from honesty.</p>

<h2>Clear cases: when removal is fine</h2>

<p><strong>Personal photos for personal use:</strong> removing photobombers from vacation photos, cleaning up a messy room in the background of a family portrait, erasing a pimple for a profile picture. These are aesthetic improvements that do not deceive anyone about anything meaningful.</p>

<p><strong>Product photography with disclosure:</strong> removing dust, reflections, or background clutter from product photos. This is standard commercial practice. The ethical line is removing product flaws — a scratch on a used item listed as "like new," a dent on a car listed as "excellent condition." If the removal hides a defect the buyer would want to know about, it crosses into fraud.</p>

<p><strong>Creative and artistic work:</strong> composite images, surreal edits, visual art. The audience understands these are manipulated. No reasonable person looks at a surrealist photo composite and thinks it is documentary reality.</p>

<h2>Clear cases: when removal is not fine</h2>

<p><strong>Journalism and documentary photography:</strong> the standard is zero manipulation that changes content. Cropping, color correction, and exposure adjustment are acceptable. Adding or removing elements is not. A journalist who removes a person from a news photo has fabricated evidence — this is a firing offense at every reputable news organization.</p>

<p><strong>Legal and insurance evidence:</strong> photos submitted as evidence in legal proceedings, insurance claims, or official reports. Altering these is fraud. Even "minor" edits like removing a date stamp can constitute evidence tampering.</p>

<p><strong>Scientific and academic publications:</strong> research images — microscope photos, gel electrophoresis results, astronomical observations — have strict manipulation policies. Most journals explicitly prohibit adding or removing features. Violations end careers.</p>

<p><strong>Contest entries with "no manipulation" rules:</strong> many photography competitions have categories for minimally edited photos. Removing objects violates these rules and, if discovered, results in disqualification and public embarrassment.</p>

<h2>The disclosure solution</h2>

<p>When in doubt, disclose. "This photo has been edited to remove distracting background elements." One sentence, placed in the caption or description, eliminates the deception concern entirely. The viewer now knows the photo was edited and can evaluate it accordingly.</p>

<p>Transparency builds trust. Nobody gets angry about an edited photo because it was edited — they get angry because they feel tricked. Disclosure removes the trick. The editing itself is rarely the problem; the undisclosed editing is always the problem.</p>

<p>For removing watermarks (which has its own legal and ethical considerations around copyright), see our <a href="/en/tools/watermark-remover">watermark remover</a>. For removing backgrounds entirely, our <a href="/en/tools/background-remover">background remover</a> handles subject extraction. And for advanced removal techniques, read our <a href="/en/blog/object-remover-advanced-techniques">object remover advanced techniques guide</a>.</p>
`,
  },

];

// Synchronous static accessors"""

if old in content:
    content = content.replace(old, new_blogs)
    with open(BLOG_FILE, "w", encoding="utf-8") as f:
        f.write(content)
    print("OK: 6 blogs inserted into AI station blog.ts (58→64)")
else:
    print("ERROR: insertion marker not found")
    idx = content.rfind("];")
    print(f"Last '];' at index: {idx}")
