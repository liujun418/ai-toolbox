"""Add 6 blogs to AI station (88→94 static) — July 3, 2026"""
import os, sys

BLOG_FILE = r"C:\Users\jun\ai-toolbox\src\lib\blog.ts"

with open(BLOG_FILE, "r", encoding="utf-8") as f:
    content = f.read()

old = '\n];\n\n// Synchronous static accessors'

new_blogs = r"""
  {
    slug: "photo-restorer-wedding-album-step-by-step",
    title: "Photo Restorer Wedding Album Restoration Save Irreplaceable Memories Step by Step",
    description: "Your parents' wedding album is fading, torn, and stained. Here's the complete workflow for restoring wedding photos with AI — from scanning to the final framed print.",
    date: "2026-07-03",
    category: "Edit",
    tags: ["photo restorer", "wedding album", "photo restoration", "old photos", "family memories"],
    relatedTools: ["photo-restorer", "colorizer", "image-upscaler"],
    content: `<p>Your parents' wedding album from 1972 has been in a box in the attic for 30 years. The prints are faded to sepia, the corners are torn, there's a water stain across the cake-cutting photo, and the group shot has a crease right through the groom's face. These are <strong>irreplaceable images</strong> — there's no negative, no digital original, no backup. If the photos degrade further, the memories are gone.</p>

<p><strong>AI photo restoration</strong> can bring these photos back. But doing it right — especially for a wedding album with 50+ photos — requires a systematic approach. Here's the step-by-step workflow.</p>

<h2>Step 1: Scan Once, Scan Right</h2>

<p>The scan is the foundation of everything that follows. A bad scan limits what restoration can achieve. Guidelines: scan at <strong>600 DPI minimum</strong> (1200 DPI for small prints like wallet-sized photos), save as <strong>TIFF or PNG</strong> (not JPEG — compression artifacts become permanent), use a flatbed scanner (not a phone photo of the print — perspective distortion and uneven lighting create problems that even AI can't fully fix), and clean the scanner glass before each session.</p>

<p>For prints that are stuck to album pages (common with magnetic photo albums from the 1970s-80s), don't peel them off. Scan them in place on the album page. The page background will need to be cropped or inpainted out, but that's easier than repairing a torn photo.</p>

<h2>Step 2: Triage by Damage Type</h2>

<p>Not all damage needs the same treatment. Sort photos into categories: <strong>Light damage</strong> (fading, slight yellowing) — colorization and contrast adjustment; <strong>Medium damage</strong> (scratches, dust, minor tears at edges) — inpainting and scratch removal; <strong>Heavy damage</strong> (large tears, missing pieces, water stains across faces) — AI inpainting plus manual touch-up.</p>

<p>Process light damage photos first. They'll give you quick wins and help you learn the tools before tackling the heavily damaged ones. Wedding photos have the added challenge of <strong>white details</strong> — the dress, veil, flowers — that show every stain and color cast. Pay extra attention to white balance on these.</p>

<h2>Step 3: The Restoration Pipeline</h2>

<p>Process each photo in this order: <strong>Dust and scratch removal first</strong> — AI inpainting handles small spots automatically; <strong>Tear and crease repair second</strong> — select the damaged area and let AI reconstruct the missing pixels; <strong>Color correction third</strong> — fix fading, color casts, and contrast; <strong>Colorization fourth</strong> (if the photo is black and white and you want color) — run after all structural repairs are done; <strong>Upscaling last</strong> — increase resolution for printing after all edits are complete.</p>

<p>This order matters. Colorizing a photo with dust spots and tears bakes those defects into the color layer. Upscaling before fixing damage amplifies the damage. Always repair → correct → enhance.</p>

<h2>Step 4: Quality Check and Print</h2>

<p>View each restored photo at 100% zoom. Check: edges of the frame (where cropping might have cut off details), faces (especially eyes — AI sometimes makes them slightly asymmetrical), hands (AI is notoriously bad at fingers), and text (signs, dates, any writing in the photo — AI often turns text into gibberish).</p>

<p>For the final prints, use a photo lab (not a home inkjet) for archival-quality results. Matte or lustre paper hides minor restoration artifacts better than glossy. And make digital backups — store the restored TIFF files in at least two locations.</p>

<p>For restoring your wedding and family photos, use our <a href="/en/tools/photo-restorer">AI photo restorer</a> for damage repair and enhancement. For adding color to black and white wedding photos, our <a href="/en/tools/colorizer">AI colorizer</a> brings vintage images to life. And for enlarging small prints to display size, our <a href="/en/tools/image-upscaler">image upscaler</a> increases resolution.</p>
`,
  },
  {
    slug: "background-remover-passport-visa-photo",
    title: "Background Remover Passport Visa Photo Requirements Guide for Every Country",
    description: "Passport and visa photos have strict background requirements that vary by country. Here's how to get a compliant white background without paying a photo studio every time.",
    date: "2026-07-03",
    category: "Edit",
    tags: ["background remover", "passport photo", "visa photo", "ID photo", "biometric photo"],
    relatedTools: ["background-remover", "image-upscaler", "face-blur"],
    content: `<p>You need a passport photo. The requirements: white background, even lighting, no shadows, head centered, specific size. The pharmacy charges $15 and the photo looks like a mugshot. You take a photo at home against a white wall, but it's slightly off-white, there's a shadow behind your head, and your shirt blends into the background.</p>

<p>An <strong>AI background remover</strong> solves the background problem in seconds — replace whatever's behind you with a perfectly even, pure white (#FFFFFF) background. But different countries have different rules, and getting it wrong means your application gets rejected.</p>

<h2>Passport Photo Background Rules by Country</h2>

<p><strong>United States:</strong> Plain white or off-white background. No shadows. No patterns. Head must be centered and between 1 inch and 1 3/8 inches (25-35mm) from chin to top of head. Photo size: 2×2 inches (51×51mm).</p>

<p><strong>European Union (Schengen):</strong> Plain light gray or white background. No shadows. Head must occupy 70-80% of the photo (32-36mm from chin to crown). Photo size: 35×45mm. Unlike the US, light gray is explicitly allowed — pure white is not required.</p>

<p><strong>United Kingdom:</strong> Cream or plain light gray background. Pure white is explicitly <strong>not acceptable</strong> (it can cause glare issues with automated gates). Photo size: 35×45mm.</p>

<p><strong>Canada:</strong> Plain white or light-colored background. Must contrast with the applicant's clothing and skin tone. Photo size: 50×70mm (this is larger than most countries).</p>

<p><strong>India:</strong> White background only. No colored backgrounds accepted. Photo size: 51×51mm (same dimensions as US but different head size requirements).</p>

<p><strong>China:</strong> White background. Head must be centered. No smiling (neutral expression required). Ears must be visible. Photo size: 33×48mm.</p>

<h2>Common Rejection Reasons</h2>

<p>The most common reasons passport photos get rejected: (1) <strong>background not white enough</strong> — off-white, cream, or gray when white is required; (2) <strong>shadows on the background</strong> — even a faint shadow behind the head gets flagged; (3) <strong>head size wrong</strong> — too small or too large relative to the photo dimensions; (4) <strong>uneven lighting</strong> on the face — one side brighter than the other; and (5) <strong>clothing blends with background</strong> — a white shirt on a white background makes it look like your head is floating.</p>

<h2>DIY Passport Photo Workflow</h2>

<p>1. Stand facing a window (natural light, no shadows) with any plain wall behind you. 2. Have someone take a photo from 4-5 feet away at eye level (selfies distort facial proportions). 3. Use a background remover to replace the wall with pure white (#FFFFFF for countries requiring white). 4. Crop to the required dimensions with the correct head size. 5. Use a passport photo tool or template to verify dimensions and head position.</p>

<p>For removing and replacing backgrounds, use our <a href="/en/tools/background-remover">AI background remover</a> for clean cutouts with any background color. For adjusting photo dimensions to passport specifications, our <a href="/en/tools/image-upscaler">image upscaler</a> increases resolution without quality loss. And for privacy in other photos, our <a href="/en/tools/face-blur">face blur tool</a> anonymizes bystanders.</p>
`,
  },
  {
    slug: "avatar-generator-gaming-profile-picture",
    title: "Avatar Generator Gaming Profile Picture Requirements for Every Platform",
    description: "Discord wants 128×128, Steam wants 184×184, Xbox wants 1080×1080. Here's how to create one AI avatar that works on every gaming platform without looking stretched or cropped.",
    date: "2026-07-03",
    category: "Generate",
    tags: ["avatar generator", "gaming avatar", "profile picture", "Discord", "Steam", "Xbox"],
    relatedTools: ["avatar-generator", "ai-image-generator", "image-upscaler"],
    content: `<p>You create the perfect gaming avatar — a cyberpunk version of yourself with neon reflections in your sunglasses. It looks incredible at 1024×1024. You upload it to Discord and it gets cropped to a circle, cutting off the neon reflections. You upload it to Steam and it gets squished from square to rectangle. You upload it to Xbox and it gets downscaled so aggressively that the neon turns into a blurry smudge.</p>

<p>Every gaming platform has different <strong>avatar dimensions, aspect ratios, and crop behaviors</strong>. Designing one avatar that works everywhere requires understanding what each platform does to your image.</p>

<h2>Platform-by-Platform Avatar Requirements</h2>

<p><strong>Discord:</strong> 128×128 pixels displayed, but upload at 512×512 or higher (Discord scales down). Displayed as a <strong>circle</strong> — the corners of your square image will be cropped out. Keep important content within the center 70% of the image. Maximum file size: 8MB.</p>

<p><strong>Steam:</strong> 184×184 pixels displayed. Square aspect ratio, but displayed at different sizes across Steam (friends list shows a tiny version, profile page shows larger). Upload at 1000×1000 minimum. No circle crop — full square displayed.</p>

<p><strong>Xbox:</strong> 1080×1080 pixels. Displayed as a <strong>circle</strong> on console, square on the Xbox app. This inconsistency means you need to design for both: important content in the center, but the full square should look good too.</p>

<p><strong>PlayStation Network:</strong> 440×440 pixels displayed as a circle. Upload through the PS App (not console). Background images are separate from avatars.</p>

<p><strong>Epic Games:</strong> 192×192 pixels, square display. Upload at 1000×1000. No circle crop.</p>

<p><strong>Twitch:</strong> 256×256 pixels displayed, but upload at 800×800 or higher. Circle crop in chat, square on profile page. Same dual-shape problem as Xbox.</p>

<h2>The Circle-Square Problem</h2>

<p>The biggest avatar design challenge: half the platforms crop to a <strong>circle</strong>, half show a <strong>square</strong>. Content in the corners (logos, text, decorative elements) gets cut off on circle platforms. An avatar designed only for circles looks empty and floating on square platforms.</p>

<p>The solution: <strong>design for the circle, fill for the square</strong>. Put your face or main subject in the center 60% of the image (visible on all platforms). Use the outer 40% for decorative elements that enhance the square version but aren't essential — gradients, abstract patterns, subtle textures. If they get cropped on Discord, the core avatar still works.</p>

<h2>Resolution Strategy</h2>

<p>Generate your avatar at <strong>1024×1024 or higher</strong>. Every platform will downscale it, but starting from a high resolution ensures the downscaled version stays sharp. Never generate at a platform's exact display size — you can't upscale later without quality loss, and you'll need the higher resolution for platforms that display larger.</p>

<p>For creating gaming avatars, use our <a href="/en/tools/avatar-generator">AI avatar generator</a> with multiple style options. For generating custom background elements, our <a href="/en/tools/ai-image-generator">AI image generator</a> creates complementary designs. And for ensuring your avatar stays sharp at all sizes, our <a href="/en/tools/image-upscaler">image upscaler</a> increases resolution without artifacts.</p>
`,
  },
  {
    slug: "watermark-remover-batch-photography-workflow",
    title: "Watermark Remover Batch Processing Professional Photography Workflow for Clean Portfolios",
    description: "Photographers with hundreds of watermarked preview images need batch cleanup for portfolio updates. Here's the efficient workflow that processes an entire shoot in one session.",
    date: "2026-07-03",
    category: "Edit",
    tags: ["watermark remover", "batch processing", "photography workflow", "portfolio", "image cleanup"],
    relatedTools: ["watermark-remover", "background-remover", "photo-restorer"],
    content: `<p>You're a wedding photographer with 600 photos from last weekend's shoot. You delivered the watermarked previews to the client, they selected their 80 favorites, and now you need to deliver the <strong>clean, unwatermarked final images</strong>. But here's the problem: you edited the watermarked versions, not the originals. The edits (color grading, cropping, exposure adjustments) are baked into the watermarked files.</p>

<p>This happens more often than photographers admit. The solution isn't re-editing 80 photos from scratch — it's <strong>batch watermark removal</strong> on the edited files, preserving all your adjustments while removing only the watermark.</p>

<h2>Why Batch Processing Changes Everything</h2>

<p>Removing a watermark from one photo takes 30 seconds with AI. Removing watermarks from 80 photos one by one takes 40 minutes of repetitive clicking. <strong>Batch processing</strong> brings it down to: set up the batch once, let it run, review the results. Total hands-on time: 5 minutes.</p>

<p>The key to successful batch watermark removal: <strong>all watermarks must be in the same position and size</strong>. If you used a consistent watermark placement across the shoot (which you should — it's a professional standard for exactly this reason), the AI can process every photo with the same parameters.</p>

<h2>The Batch Workflow</h2>

<p><strong>Step 1: Verify watermark consistency.</strong> Scan through the 80 photos at thumbnail size. Do all watermarks appear in the same corner? Same opacity? Same size relative to the image? If yes, batch processing will work. If watermarks jump around (different positions, different sizes), group photos by watermark position and batch each group separately.</p>

<p><strong>Step 2: Process a test batch of 3-5 photos.</strong> Check the results at 100% zoom. Look for: residual watermark ghosting (a faint outline where the watermark was), texture mismatches (the area where the watermark was removed has different grain or texture than the surrounding area), and edge artifacts (visible boundaries where the AI inpainted).</p>

<p><strong>Step 3: Adjust parameters based on test results.</strong> If ghosting appears, the AI needs a larger inpainting margin around the watermark. If texture mismatches appear, the AI needs more context (the inpainting algorithm should sample from a larger area around the watermark).</p>

<p><strong>Step 4: Run the full batch.</strong> Process all 80 photos. Spot-check every 10th photo at 100% zoom. If you find issues in one, check the photos before and after it — problems tend to cluster.</p>

<h2>When Batch Processing Fails</h2>

<p>Batch watermark removal struggles with: watermarks that overlap complex textures (a watermark across a brick wall and a window needs different treatment on each surface), watermarks that cross high-contrast edges (the edge of a face, the horizon line), and semi-transparent watermarks that cover detailed areas (lace on a wedding dress, hair texture). For these, pull the individual photo out of the batch and process it manually.</p>

<p>For batch watermark removal, use our <a href="/en/tools/watermark-remover">AI watermark remover</a> with consistent placement settings. For extracting subjects from watermarked images, our <a href="/en/tools/background-remover">background remover</a> handles cutouts. And for repairing any residual damage from watermark removal, our <a href="/en/tools/photo-restorer">photo restorer</a> fixes texture and grain issues.</p>
`,
  },
  {
    slug: "image-upscaler-vs-ai-generator-low-res",
    title: "Image Upscaler vs AI Image Generator Which Fixes a Low-Resolution Photo Better",
    description: "You have a blurry 480p photo. Should you upscale the original or generate a new version with AI? The answer depends on what's in the photo and what you need it for.",
    date: "2026-07-03",
    category: "Edit",
    tags: ["image upscaler", "AI image generator", "low resolution", "photo fix", "image enhancement"],
    relatedTools: ["image-upscaler", "ai-image-generator", "photo-restorer"],
    content: `<p>You have one photo of your grandparents from the 1960s. It's 480×360 pixels — a scan of a scan of a wallet-sized print. You want to print it at 8×10 inches for their anniversary party. You have two completely different options: <strong>upscale the original</strong> using AI to increase resolution while preserving the actual people and details, or <strong>generate a new image</strong> using AI that looks like them but isn't actually them.</p>

<p>This is the fundamental fork in the road for low-resolution photos, and picking the wrong path means either a blurry print or a photo of strangers who sort of look like your grandparents.</p>

<h2>Option 1: AI Upscaling — Enhance What's There</h2>

<p>AI upscaling takes your existing pixels and <strong>predicts what higher-resolution versions should look like</strong>. It's not inventing new content — it's inferring detail from patterns in the existing pixels. For a face, it sharpens edges, reduces noise, and fills in texture (skin, hair, fabric) that the low-resolution version lost.</p>

<p>Upscaling preserves: <strong>identity</strong> (the people in the photo remain the same people), <strong>details</strong> that exist in the original (clothing patterns, background objects, facial expressions), and <strong>authenticity</strong> (the photo remains a photo of the original moment).</p>

<p>Upscaling fails when: the original is <strong>too low resolution</strong> (below 200×200 pixels — there's simply not enough data to infer from), the original has <strong>heavy compression artifacts</strong> (JPEG blocks become "detail" that the upscaler sharpens instead of removing), or you need a <strong>massive size increase</strong> (going from 480p to 8K requires the AI to invent too much — the result looks painterly, not photographic).</p>

<h2>Option 2: AI Generation — Create Something New</h2>

<p>AI image generation creates an <strong>entirely new image</strong> based on a text description. You could prompt: "An elderly couple in 1960s clothing, wedding anniversary, warm lighting, photorealistic." The result looks great — sharp, high-resolution, properly lit. But the people in the photo are not your grandparents. They're AI-generated people who match the description.</p>

<p>Generation works best when: you don't have <strong>any</strong> photo of the specific moment (you're creating a representation, not restoring a memory), the original photo is <strong>beyond recovery</strong> (completely destroyed, only a verbal description remains), or you need a <strong>concept image</strong> (stock photo, illustration, mood board) where authenticity doesn't matter.</p>

<h2>The Decision Framework</h2>

<p><strong>Use upscaling when:</strong> the photo contains specific people you want to preserve, the original is at least 300×300 pixels, you need the result to be factually accurate to the original moment, and the photo has sentimental or documentary value.</p>

<p><strong>Use generation when:</strong> you don't have a photo at all (you're creating from description), the original is too damaged to recover, you need a conceptual or artistic image (not a factual record), and authenticity is not required.</p>

<p><strong>Use both in sequence when:</strong> the photo is partly recoverable. Upscale first to see what can be saved. If specific areas are beyond recovery (a face that's completely obscured), use inpainting/generation to fill just those areas while preserving the rest.</p>

<p>For increasing resolution of real photos, use our <a href="/en/tools/image-upscaler">AI image upscaler</a> for 2×-4× enhancement. For creating images from descriptions, our <a href="/en/tools/ai-image-generator">AI image generator</a> creates high-resolution originals. And for repairing damaged areas before upscaling, our <a href="/en/tools/photo-restorer">photo restorer</a> fixes scratches and tears.</p>
`,
  },
  {
    slug: "photo-manipulation-history-stalin-to-ai",
    title: "The History of Photo Manipulation From Stalin's Airbrush to AI Inpainting",
    description: "Photo manipulation didn't start with Photoshop. From Stalin erasing political rivals in the 1930s to AI removing objects in seconds — the technology changed, the impulse didn't.",
    date: "2026-07-03",
    category: "Edit",
    tags: ["photo manipulation", "history", "Stalin", "Photoshop", "AI inpainting", "ethics"],
    relatedTools: ["object-remover", "photo-restorer", "watermark-remover"],
    content: `<p>In 1930, a Soviet photographer took a picture of Joseph Stalin standing next to Nikolai Yezhov, head of the secret police. By 1940, Yezhov had been executed during the Great Purge, and the photo had been <strong>retouched</strong> — Yezhov was painted out with an airbrush, replaced with empty canal water. The photo manipulation was so thorough that for decades, official Soviet archives showed Stalin standing alone.</p>

<p>Eighty years later, you can remove your ex from a vacation photo with one click. The <strong>technology</strong> has changed beyond recognition. The <strong>human impulse</strong> — to edit reality, to remove what we don't want to see, to present a curated version of the world — hasn't changed at all.</p>

<h2>The Pre-Digital Era: Airbrush, Scalpel, and Darkroom</h2>

<p>Before Photoshop (released 1990), photo manipulation was <strong>physical and painstaking</strong>. Soviet censors used airbrushes and fine paintbrushes to literally paint over political enemies — a process that took hours per photo and required an artist's steady hand. The results, examined closely, show brush strokes and paint texture that reveal the manipulation.</p>

<p>Western publications weren't innocent. In 1982, National Geographic moved the Great Pyramids of Giza closer together on a cover photo to make them fit the vertical format. The scandal led to a new term: <strong>"National Geographic effect"</strong> — the realization that even trusted sources manipulated images.</p>

<p>Darkroom techniques allowed dodging (lightening areas), burning (darkening areas), and compositing (combining multiple negatives into one print). The famous "Cottingley Fairies" photos (1917) — which convinced Sir Arthur Conan Doyle that fairies were real — were paper cutouts photographed in a garden. No digital technology required.</p>

<h2>1990-2015: The Photoshop Era</h2>

<p>Photoshop democratized photo manipulation. What took a Soviet censor hours with an airbrush took a Photoshop user seconds with the clone stamp tool. The 2000s saw the rise of <strong>"Photoshop" as a verb</strong> and the beginning of public awareness that magazine covers, advertisements, and even news photos might be altered.</p>

<p>Key moments: The 2006 Lebanon War photo scandal (a Reuters photographer cloned additional smoke into a Beirut skyline photo — Reuters fired him and withdrew all 920 of his photos). The 2008 Iranian missile test photo (Iran released a photo showing four missiles launching; one was clearly cloned from another because the exhaust plumes were identical). Both scandals proved that <strong>detection hadn't caught up with creation</strong>.</p>

<h2>2015-Present: AI Inpainting and the Authenticity Crisis</h2>

<p>AI inpainting (what modern object removers use) is fundamentally different from clone stamping or airbrushing. The clone stamp copies existing pixels from elsewhere in the image. AI inpainting <strong>generates new pixels</strong> that never existed in the original — it's not copying, it's creating. The removed object isn't replaced with a copy of something else in the photo; it's replaced with what the AI predicts <strong>should</strong> be there based on training from millions of other photos.</p>

<p>This is qualitatively different from all previous manipulation. A Soviet censor had to paint Yezhov out pixel by pixel. An AI can remove him and generate plausible canal water, reflections, and ripples in seconds — with no visible trace of the edit.</p>

<p>We're now in an era where: (1) AI can remove objects from photos with no detectable artifacts, (2) AI can generate entirely fake photos from text prompts, and (3) AI can detect AI-generated or AI-edited photos with reasonable accuracy. The arms race between creation and detection continues.</p>

<h2>What Hasn't Changed</h2>

<p>Stalin removing Yezhov in 1940 and someone removing their ex from a beach photo in 2026 are motivated by the same impulse: <strong>control over the visual record</strong>. The technology determines how easy it is, how detectable it is, and who can do it. But the ethical question — when is it okay to alter a photo, and who gets to decide — is the same question photographers have been asking since the first darkroom.</p>

<p>For removing unwanted elements from photos, use our <a href="/en/tools/object-remover">AI object remover</a> with inpainting technology. For restoring old manipulated or damaged photos, our <a href="/en/tools/photo-restorer">photo restorer</a> recovers original details. And for understanding watermark ethics, our <a href="/en/tools/watermark-remover">watermark remover</a> page covers digital ownership.</p>
`,
  },

];

// Synchronous static accessors"""

if old not in content:
    print("ERROR: marker not found!")
    sys.exit(1)

content = content.replace(old, new_blogs)
with open(BLOG_FILE, "w", encoding="utf-8") as f:
    f.write(content)
print("AI station: 6 blogs inserted (88 -> 94 static)")
