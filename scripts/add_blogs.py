"""Add 6 blogs to AI station (347->353 static) - August 20, 2026"""
BLOG_FILE = r"C:\Users\jun\ai-toolbox\src\lib\blog.ts"

with open(BLOG_FILE, "r", encoding="utf-8") as f:
    content = f.read()

old = '\n];\n\n// Synchronous static accessors'

new_blogs = r"""
  {
    slug: "watermark-remover-invisible-ai-watermarks-guide",
    title: "Invisible Watermarks in AI Images: Why Cropping Can't Remove Them",
    description: "You can crop a visible logo out of an AI image. The watermark you can't see is another story — it's baked into the pixels, and it's not going anywhere.",
    date: "2026-08-20",
    category: "Edit",
    tags: ["invisible watermark", "AI watermark", "C2PA", "image provenance", "watermark remover"],
    relatedTools: ["watermark-remover", "background-remover", "image-description"],
    content: `<p>You generate an image with an AI tool and a small logo sits in the corner. Fine — you run it through a <a href="/en/tools/watermark-remover">watermark remover</a>, or crop the corner off, and the image is clean. Then a friend who works in content safety asks whether the image still carries a watermark. You zoom in, squint, find nothing. "Because it's invisible," she says. "It's in the pixels." This is the watermark argument everyone is having in 2026, and it's really two different arguments wearing the same name.</p>

<h2>Two Kinds of Watermark, Two Jobs</h2>

<p>The visible watermark is a deterrent. It's a name or a logo slapped across a corner so people don't claim the image as their own — and it's removable, by cropping, by inpainting, or by the <a href="/en/tools/watermark-remover">watermark remover tool</a>. The invisible watermark is a provenance stamp. The generator that made the image encodes a signature directly into the pixel values — tiny patterns you can't see with your eyes but that a detector can read. It survives cropping, resizing, and recompression. You can remove the corner logo and the image is still silently labeled with where it came from.</p>

<h2>Why Cropping Can't Fix It</h2>

<p>The counter-intuitive part: the two techniques are used for opposite reasons. Visible marks stop casual copying; invisible marks answer the question "which model made this?" That's the point of schemes like C2PA and the pixel-signatures used by major image generators. The signature is spread across the whole image, so there's no single place to remove — and scrubbing it means destroying the image. Worse, for images you generated yourself, actively removing the invisible mark can violate the tool's terms of service, because that signature is the link between the image and your account.</p>

<h2>What You Can and Can't Clean</h2>

<p>So the honest workflow is: if a visible logo is the problem, clean it — that's exactly what the <a href="/en/tools/watermark-remover">watermark remover</a> is for, and the <a href="/en/tools/background-remover">background remover</a> handles the cases where the mark sits on a flat area you'd rather replace. If you want to know what an image actually contains and whether it looks doctored, an <a href="/en/tools/image-description">image description</a> tool reads the content the way a detector reads the provenance. The invisible watermark isn't a fight you're meant to win; it's a receipt. Knowing the difference — that visible marks are removable deterrents and invisible marks are permanent signatures — keeps you from breaking the terms you agreed to while trying to tidy a corner.</p>

<p>We covered visible watermark removal strategy in our guide to <a href="/en/blog/watermark-remover-transparent-vs-solid-strategies">transparent vs solid watermarks</a>. The invisible layer is the sequel: the mark you can't see at all, and the one that was never meant to come off.</p>`
  },
  {
    slug: "object-remover-shadow-leftover-guide",
    title: "Object Remover and the Shadow Problem: Why the Object Goes but the Shadow Stays",
    description: "You remove the bottle from the photo. The bottle is gone — but a faint gray ghost where it sat isn't. Here's why shadows survive removal and how to clean them.",
    date: "2026-08-20",
    category: "Edit",
    tags: ["object remover", "shadow removal", "inpainting", "photo cleanup", "image editing"],
    relatedTools: ["object-remover", "background-remover", "watermark-remover"],
    content: `<p>You're shooting product photos on a shelf at home. In the background, a bottle of water keeps appearing in the frame. You drag it into the <a href="/en/tools/object-remover">object remover</a>, select it, and let the AI do its thing. The bottle vanishes. And where it stood, there's a faint gray patch — a ghost of the bottle, exactly the shape of the shadow it used to cast. You remove it again. The ghost gets a little lighter but doesn't disappear. This is the most common complaint people have with object removal, and it's not a bug — it's how inpainting sees shadows.</p>

<h2>Why the Shadow Survives</h2>

<p>An object remover reconstructs the area you selected using the pixels around it. It's very good at guessing "what texture belongs on a shelf," and it's much less good at "there was a broad lighting gradient here caused by the thing I'm removing." A shadow is a gradual darkening across a wide region, not a clean shape with edges — so the AI often fills in the area with the surrounding shelf texture and leaves the tone slightly wrong. The darkening registers as a patch, and because the model thinks it already rebuilt that region, it doesn't reach back to fix the lighting.</p>

<h2>The Fix: Include the Shadow in the Selection</h2>

<p>The counter-intuitive trick is to select more, not less. The instinct is to trace tightly around the object so you don't remove anything else — but a tight selection leaves the shadow outside it, exactly where the algorithm won't touch it. Select the object <em>and</em> its shadow as one region, and the inpainter has the whole visual problem in front of it: it has to rebuild the shelf where the shadow used to be, and it uses the brighter pixels around it to do it. That single change turns most ghost-shadow removals into clean ones.</p>

<h2>When It's Too Stubborn</h2>

<p>If the shadow spans a big area or crosses into other objects, the shadow is doing more than sitting there — it's carrying the photo's lighting, and rebuilding it is a bigger job. On a plain backdrop, the shortcut is the <a href="/en/tools/background-remover">background remover</a>: remove the whole background and re-add a clean one, and the shadow disappears with it. And when the leftover is a faint mark rather than a lighting change, the <a href="/en/tools/watermark-remover">watermark remover</a> uses the same inpainting in a tighter mode — a second pass with it often finishes what the first pass started.</p>

<p>We covered transparent objects and complex backgrounds in our guide to <a href="/en/blog/object-remover-advanced-techniques-edge-cases">object remover edge cases</a>. The shadow is the case people write to us about most. Select the shadow with the object, and the ghost finally leaves the frame.</p>`
  },
  {
    slug: "style-transfer-portrait-face-distortion-guide",
    title: "Why Style Transfer Ruins Faces (and the Portrait-Safe Workflow)",
    description: "Run a selfie through style transfer and the face comes out looking melted. Here's why portraits break the tool — and how to stylize a photo without destroying the person.",
    date: "2026-08-20",
    category: "Generate",
    tags: ["style transfer", "face distortion", "portrait style", "photo to art", "AI art"],
    relatedTools: ["style-transfer", "ai-image-generator", "avatar-generator"],
    content: `<p>You take a great photo of yourself at a café and run it through a <a href="/en/tools/style-transfer">style transfer</a> tool with the watercolor preset. The output comes back and the café looks beautiful — the light, the table, the color. Then you look at your face, and your face looks like it was drawn by someone who has only heard descriptions of faces. The nose is wrong. The eyes have drifted. It's not a bad filter; it's that style transfer is doing something your face specifically can't survive.</p>

<h2>Why Faces Break First</h2>

<p>Style transfer works on whole-image statistics — it takes the textures and color patterns of one image and forces them onto another. That's great for a landscape, where texture <em>is</em> the content. But a face is a collection of precise, small landmarks — the eye spacing, the jawline, the mouth — and forcing a painterly texture across them displaces those landmarks. The algorithm has no concept of "this blob is a nose," so it treats the nose as just another region to smear. Landscapes can tolerate the smearing. Faces can't, which is why every failed style-transfer image you've seen was a portrait.</p>

<h2>The Portrait-Safe Workflow</h2>

<p>The fix is to stop fighting the tool and change what you ask it to do. First, if the tool has a "portrait mode" or "face preservation" option, use it — that's the whole point of the setting. Second, dial the style strength down from 100%. The failure isn't binary: at lower intensity, the texture reads as a subtle effect and the landmarks survive. Third, and most reliably: don't style the face at all. Stylize the scene, then composite your original, un-stylized face back over the result — most editors make this a two-minute job.</p>

<h2>When the Tool Is the Wrong Tool</h2>

<p>The counter-intuitive part: if you want a painterly <em>portrait</em> — not just a painterly photo of a person — the transfer is fighting the hardest possible input. The <a href="/en/tools/ai-image-generator">AI image generator</a> builds a face-aware painting from scratch, and it understands anatomy better than a transfer does. And for consistent, face-accurate results, the <a href="/en/tools/avatar-generator">avatar generator</a> was built around keeping likeness — that's the tool to reach for when the person has to stay recognizable. Style transfer is for scenes, textures, and moods. The moment you point it at a face, you're asking it to do the one thing it can't.</p>

<p>We covered realistic versus artistic modes in our guide to <a href="/en/blog/style-transfer-realistic-vs-artistic-modes">style transfer modes</a>. Faces are where the artistic mode shows its limits — stylize the scene, protect the face, and the portrait keeps looking like someone.</p>`
  },
  {
    slug: "article-generator-youtube-video-scripts-guide",
    title: "Article Generator for Video Scripts: From Topic to Full YouTube Script",
    description: "The blank document at 11pm, the cursor blinking. An article generator won't write your video — but it will build the outline, hooks, and sections that make one.",
    date: "2026-08-20",
    category: "Content",
    tags: ["video script", "YouTube script", "article generator", "script writing", "content creation"],
    relatedTools: ["article-generator", "text-polish", "text-to-speech"],
    content: `<p>It's 11pm and you're staring at a blank document. The channel is about budget cooking, and you've had the video idea for two weeks: "Meal prepping on $30 a week." You type a sentence, delete it. Type another, delete it. You know the material — you've been doing this exact thing for years — but the words won't come out in the right order, and you're not sure they ever did. The <a href="/en/tools/article-generator">article generator</a> sitting in your bookmarks isn't the answer to this problem. It's the answer to a much better one.</p>

<h2>Use It as an Outline Machine, Not a Writer</h2>

<p>Ask the generator for a structure, not a script: "Write an outline for a 10-minute YouTube video on meal prepping for $30 a week. Hook first, then the problem, three concrete sections, the payoff, and a call to action." What comes back is a skeleton — the hook, the three beats, the ending — and that skeleton is the 90% of the work you were stuck on. The counter-intuitive part is to stop right there. Don't ask it to write the finished script, because a generated script reads like writing, and a video script needs to sound like talking.</p>

<h2>The Editing Pass That Makes It Speak</h2>

<p>Video scripts are spoken, not written, and the gap is bigger than you think. An 800-word written article is roughly five minutes of speech. So run the draft through the <a href="/en/tools/text-polish">text polish</a> tool with an eye for cutting: shorten every sentence, remove every clause you could live without, then cut another 30%. Read it aloud — any sentence you stumble over is a sentence that will trip you on camera. And if you want to hear the pacing before you record, the <a href="/en/tools/text-to-speech">text to speech</a> tool gives you a rough-cut of the timing, so you can see where the video drags before you've spent an afternoon filming it.</p>

<h2>The Parts to Write Yourself</h2>

<p>The best use of the generator is the bits that are hardest to invent cold: five versions of the hook, asked for and picked from, and the transition sentences that move the viewer between sections. The rest — the actual tips, the specific numbers, the mistakes you've made — has to be yours, because that's what makes a cooking channel watchable. A script is a scaffold for your knowledge, not a replacement for it.</p>

<p>We covered the editing workflow for AI drafts in our guide to <a href="/en/blog/article-generator-edit-ai-drafts-human">turning AI drafts into human-readable content</a>. Scripts are that workflow's most demanding case — outline with the generator, polish the prose, and keep the voice that only you have.</p>`
  },
  {
    slug: "image-upscaler-logos-line-art-vector-guide",
    title: "Upscaling Logos and Line Art: Why They Turn to Mush (and When Vector Wins)",
    description: "Your client's logo is a 200px PNG and they need a banner. The upscaler returns a bigger blur. Logos aren't photos — here's when to upscale and when to redraw.",
    date: "2026-08-20",
    category: "Edit",
    tags: ["image upscaler", "logo upscaling", "vector graphics", "line art", "SVG"],
    relatedTools: ["image-upscaler", "ai-image-generator", "background-remover"],
    content: `<p>Your client sends a logo for the new banner: a 200px PNG. "Can you make it bigger?" they ask, the way people ask for impossible things. You run it through an <a href="/en/tools/image-upscaler">image upscaler</a>, get a 1600px PNG, open it, and stare. The text is fuzzy. The edges are blobby. The curves look like they were drawn by a shaky hand. The upscaler did its job — and its job is the wrong job for a logo.</p>

<h2>Photos and Logos Are Different Animals</h2>

<p>An upscaler invents detail. Feed it a photo and it has texture to work with — grain, gradients, soft edges — so when it "reconstructs" a sharper version, the invention is invisible and often looks great. Feed it a logo and the whole image is hard edges and flat color, and there is no texture to invent. The AI has to decide where every edge goes, and at 4x it hallucinates: halos around letters, bumps on curves, little smears where a crisp corner used to be. Text is the worst case — small letterforms turn to mush because the upscaler can't tell a serif from a smudge.</p>

<h2>The Wrong Move Most People Make</h2>

<p>The mistake isn't using the upscaler — it's using the upscaler and sending the result to print, or accepting the smeared 1600px PNG as "good enough." A logo that's been upscaled will always look worse than it did, just larger. The counter-intuitive truth: if it's a logo, a diagram, or line art, you don't want more pixels at all. You want a vector. A vector file — SVG, or a redrawn version in any vector tool — is resolution-independent: it's not enlarged, it's redrawn from math, so it's equally crisp at 200px and 20,000px.</p>

<h2>When to Use What</h2>

<p>Use the <a href="/en/tools/image-upscaler">image upscaler</a> on the photographic parts of a design — the product shot, the texture, the background — where invented detail is fine. For the logo itself, isolate the mark with the <a href="/en/tools/background-remover">background remover</a>, then either trace it in a vector tool or ask an <a href="/en/tools/ai-image-generator">AI image generator</a> to redraw it as a clean vector-style version. It's slightly more work than one click — and it's the difference between a banner that looks stretched and one that looks designed.</p>

<p>We checked whether upscalers really turn 480p into 4K in our guide to <a href="/en/blog/image-upscaler-480p-to-4k-reality-check">the upscaling reality check</a>. Logos are the case where even the best upscaler is the wrong tool — redraw, don't enlarge.</p>`
  },
  {
    slug: "photo-restorer-blurry-photos-deblur-guide",
    title: "Photo Restorer and Blurry Photos: What AI Deblurring Can (and Can't) Recover",
    description: "That blurry photo of your parents from 1987 — can AI make it sharp? Sometimes. The answer depends on which kind of blur it is, and what you're willing to accept.",
    date: "2026-08-20",
    category: "Edit",
    tags: ["deblur", "blurry photos", "photo restorer", "motion blur", "photo restoration"],
    relatedTools: ["photo-restorer", "image-upscaler", "face-blur"],
    content: `<p>Your favorite photo of your parents is also your worst copy of it. Taken in 1987 at a cousin's wedding, it's soft — their faces are there, the smiles are visible, but everything has a slightly dreamy, out-of-focus quality that the photographer never intended. You've tried everything: no amount of sharpening makes it crisp. Then you hear about AI deblurring and you wonder, for the hundredth time, whether the one photo you actually care about can finally be fixed. The answer is a qualified yes — and it depends entirely on what "blurry" means in this particular photo.</p>

<h2>Two Kinds of Blur, Two Outcomes</h2>

<p>There are two blur families. Motion blur happens when the camera or the subject moved during the shot — it smears pixels in a direction, leaving a trail. Out-of-focus blur happens when the lens wasn't focused — everything softens equally, spreading each point of light into a disk. AI handles motion blur dramatically better, because a directional smear is a predictable pattern that reconstruction can partially reverse. Out-of-focus blur is a much harder problem: the information was never captured, and the AI has to invent what a focused version would have looked like.</p>

<h2>What the AI Actually Does</h2>

<p>An AI photo restorer trained on sharp/blurry pairs doesn't undo blur the way you'd un-splash water. It looks at the blurred region and guesses the most likely sharp detail — edges, texture, the probable shape of an eye — and draws it in. The <a href="/en/tools/photo-restorer">photo restorer</a> will make a blurry photo look noticeably sharper, but the sharpness it adds to a face is a confident guess, not a recovered fact. That's fine for a family album and a serious problem if you need to identify someone. The counter-intuitive part: check the face first. If the deblurred person looks like the person, you've won; if the nose looks different, that's the invention showing.</p>

<h2>The Order of Operations</h2>

<p>One rule makes the biggest difference: deblur first, upscale second — never the reverse. If you enlarge a blurry photo first, the upscaler invents detail on top of a mess, and the deblur tool has less to work with. Run the <a href="/en/tools/photo-restorer">photo restorer</a> on the original, then the <a href="/en/tools/image-upscaler">image upscaler</a> on the result. And if you're torn between preserving and anonymizing an old face, the <a href="/en/tools/face-blur">face blur</a> tool is the mirror image of this problem — the same facial technology, pointed in the opposite direction.</p>

<p>We covered what AI can and can't fix in our guide to <a href="/en/blog/photo-restorer-damage-types-repair-guide">photo restorer damage types</a>. Blur is its own category. Deblur motion, sharpen cautiously, and accept that some photos are soft forever — the memory they hold doesn't depend on the focus.</p>`
  },
];

// Synchronous static accessors"""

content = content.replace(old, new_blogs)

with open(BLOG_FILE, "w", encoding="utf-8", newline="\n") as f:
    f.write(content)

print("AI station: 347->353 static objects done.")
