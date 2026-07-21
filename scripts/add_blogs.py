"""Add 6 blogs to AI station (190→196 static) — July 21, 2026"""
import os, sys

BLOG_FILE = r"C:\Users\jun\ai-toolbox\src\lib\blog.ts"

with open(BLOG_FILE, "r", encoding="utf-8") as f:
    content = f.read()

old = '\n];\n\n// Synchronous static accessors'

new_blogs = r"""
  {
    slug: "photo-restorer-film-photography-negatives-slides",
    title: "Photo Restorer for Film Photography How to Digitize and Restore Old Negatives Slides and Film Prints with AI",
    description: "You found a box of 35mm negatives from the 1970s. They are dusty, scratched, and the colors have shifted. AI photo restoration can recover them — here's the film digitization and restoration workflow.",
    date: "2026-07-21",
    category: "Edit",
    tags: ["photo restorer", "film photography", "negatives", "slides", "digitization"],
    relatedTools: ["photo-restorer", "colorizer", "image-upscaler"],
    content: `<p>You find a shoebox in your parents' attic. Inside: 200 35mm negatives from the 1970s — family vacations, childhood birthdays, your parents' wedding. The negatives are dusty. Some are scratched. The colors on the aging film have shifted — the once-vibrant Kodachrome reds are now muted, and the whites have yellowed. You hold the negatives up to the light and squint. You can see your mother as a young woman, laughing at something off-camera. You want to see these images clearly — not as faded negatives, but as restored digital photographs.</p>

<p>A <a href="/en/tools/photo-restorer">photo restorer</a> combined with a basic film scanning setup can recover these images. Here is the film digitization and restoration workflow for negatives and slides.</p>

<h2>Step 1: Digitize the Negatives</h2>

<p>You need to convert the physical negatives into digital files. Options: a dedicated film scanner (produces the best quality — 4000+ DPI, color-accurate — but costs $200-500), a flatbed scanner with a transparency unit (good quality for the price — 2400-4800 DPI for film), or a DSLR/mirrorless camera with a macro lens and a light table (fastest method — photograph the negative against a bright, even light source, then invert the colors in software).</p>

<p>For each option: scan or photograph at the highest resolution possible — 2400 DPI minimum for 35mm film. The scan captures the negative. Software (Lightroom, Photoshop, or free tools like Darktable) inverts the negative to a positive image. The output is a digital photo that still has the dust, scratches, and color shifts of the original film.</p>

<h2>Step 2: Restore with AI</h2>

<p>Upload the digitized photo to the <a href="/en/tools/photo-restorer">photo restorer</a>. The AI enhances: contrast and sharpness (film scans often look soft — the AI sharpens the image), dust and scratch removal (the AI detects and removes the small white specks and scratches that are visible on every film scan), and color correction (the AI reduces the yellow cast of aging film and restores a more natural color balance).</p>

<p>The AI restoration handles the bulk of the cleanup. For heavily damaged negatives — deep scratches, mold, torn sprocket holes — the AI provides a starting point. Manual retouching may be needed for the most severe damage.</p>

<h2>Step 3: Colorize (Optional)</h2>

<p>If the negatives are black-and-white, use the <a href="/en/tools/colorizer">colorizer</a> to add color. The AI estimates the colors based on the scene content. The colors are plausible, not historically accurate. For family photos, the emotional impact of color usually outweighs the historical inaccuracy. The colorized version makes the past feel present. The black-and-white original preserves the historical record. Keep both.</p>

<h2>Step 4: Archive the Digital Files</h2>

<p>Save three versions of each photo: the raw scan (the original digitization — unmodified, the digital negative), the restored version (AI-enhanced, cleaned, color-corrected), and the colorized version (if applicable — AI-colorized for emotional connection). Store all three with metadata: date, location, people in the photo, and restoration notes. The raw scan is the archival master. The restored versions are the viewing copies. The film negatives go back in the shoebox — or better, into archival sleeves in a climate-controlled environment.</p>

<p>Digitize and restore your film at <a href="/en/tools/photo-restorer">AI photo restorer</a> — from shoebox to screen, from faded negative to restored memory.</p>`
  },
  {
    slug: "face-blur-witness-protection-legal-documentation",
    title: "Face Blur for Witness Protection and Legal Documentation How to Anonymize Sensitive Evidence While Preserving Its Evidentiary Value",
    description: "A legal document includes a photo of a witness whose identity must be protected. Blurring the face preserves the photo's evidentiary value while protecting the person. Here's the legal documentation workflow.",
    date: "2026-07-21",
    category: "Edit",
    tags: ["face blur", "witness protection", "legal", "evidence", "anonymization"],
    relatedTools: ["face-blur", "object-remover", "watermark-remover"],
    content: `<p>You are a paralegal preparing evidence for a trial. A key piece of evidence is a photograph that shows a witness at a specific location at a specific time. The photo proves the witness's presence — which is critical to the case. But the witness's identity must be protected. Publishing the unblurred photo would endanger the witness. The photo must be <strong>anonymized</strong> while preserving its <strong>evidentiary value</strong> — the fact that a person was present, at that location, at that time.</p>

<p>A <a href="/en/tools/face-blur">face blur</a> tool solves this. The AI detects the face. The blur is applied. The person is anonymized. The photo's evidentiary value is preserved — the location, the time, the presence of a person, and the surrounding context are all still visible. Only the identity is protected. Here is the legal documentation anonymization workflow.</p>

<h2>Why Face Blur Is the Standard for Evidence Anonymization</h2>

<p>In legal contexts, evidence must be both <strong>authentic</strong> (proven to be what it claims to be) and <strong>admissible</strong> (meeting the rules of evidence). Anonymization must not destroy the evidence's authenticity. The photo must still prove what it is supposed to prove. Face blur is the preferred anonymization method because: it preserves the surrounding context (the location, the objects, the other people, the time of day), it is visibly an anonymization (the blur is obvious — no one can claim the photo was altered deceptively), and it is irreversible (once blurred, the face cannot be recovered — the anonymization is permanent).</p>

<p>The alternative — pixelation or full masking — is also acceptable but produces a less natural-looking result. The choice of anonymization method depends on the court's requirements and the sensitivity of the case.</p>

<h2>The Legal Anonymization Workflow</h2>

<p><strong>Step 1: Preserve the original, unmodified photo.</strong> The original is the evidence. The blurred version is a derivative work. The original must be preserved in its unmodified state — with a chain of custody documented. The blur is applied to a copy, never to the original.</p>

<p><strong>Step 2: Apply the face blur.</strong> Use the <a href="/en/tools/face-blur">face blur</a> tool on the copy. The AI detects faces automatically. Apply the blur at a sufficient radius — at least 20 pixels for Gaussian blur. The blur should be visibly obvious — a subtle blur that could be mistaken for an out-of-focus photo is not sufficient. The blur must communicate: "This face has been intentionally anonymized."</p>

<p><strong>Step 3: Document the anonymization process.</strong> Record: the date and time of anonymization, the person who performed the anonymization, the tool used, the method (Gaussian blur, pixelation, masking), the blur radius or pixelation block size, and a statement that the original unmodified photo is preserved and available for verification. The documentation is part of the chain of custody. It proves that the anonymization was performed correctly and that the original evidence is preserved.</p>

<p><strong>Step 4: Submit the blurred version as the exhibit.</strong> The blurred photo is the public-facing exhibit. The original is the sealed evidence — available to the court and counsel, but not to the public. The face blur satisfies the witness protection requirement. The preserved original satisfies the evidentiary requirement. Both are necessary. Neither alone is sufficient.</p>

<h2>When Face Blur Is Not Enough</h2>

<p>Face blur does not protect against identification by: distinctive clothing, visible tattoos, unique accessories, or the surrounding context (a person's home, workplace, or vehicle). If the surrounding context could identify the person, additional anonymization is required — cropping, blurring the background, or removing identifying objects. The face blur is the first step. The surrounding context is the second. Both must be addressed for complete anonymization. Use the <a href="/en/tools/face-blur">AI face blur</a> for the face — and review the entire photo for other identifying information.</p>`
  },
  {
    slug: "object-remover-product-photography-clean-catalog",
    title: "Object Remover for Product Photography How to Create Clean Consistent Catalog Images from Imperfect Source Photos",
    description: "Your product photos have dust specks, reflections, and background distractions. AI object removal cleans them up for a professional catalog. Here's the e-commerce product photo cleanup workflow.",
    date: "2026-07-21",
    category: "Edit",
    tags: ["object remover", "product photography", "catalog", "cleanup", "e-commerce"],
    relatedTools: ["object-remover", "background-remover", "image-upscaler"],
    content: `<p>You photograph 100 products for your e-commerce catalog. The lighting is good. The products are in focus. But when you review the photos at 100% zoom, you see: dust specks on a black product surface, a reflection of the photographer in a shiny surface, a stray hair on a fabric product, and background distractions (a power outlet, a shadow, a scuff on the backdrop). Each photo has 2-5 small imperfections. Across 100 products, that is 200-500 issues to fix. Manual retouching would take days.</p>

<p>An <a href="/en/tools/object-remover">AI object remover</a> handles each issue in seconds. Circle the imperfection. Click remove. The AI fills the area with the surrounding surface. The product looks perfect. The catalog looks professional. Here is the product photo cleanup workflow.</p>

<h2>The Product Photo Imperfection Checklist</h2>

<p>Go through every product photo and check for these five categories. They appear in roughly 70% of product photos.</p>

<p><strong>Category 1: Dust and debris.</strong> Dust specks are the most common imperfection — especially on dark products. They are invisible to the naked eye during the shoot but glaringly obvious at 100% zoom on a computer screen. The AI removes them in one click. Each dust speck is a small circle against a uniform product surface — the easiest case for AI inpainting.</p>

<p><strong>Category 2: Reflections.</strong> Shiny products (glass, metal, polished surfaces) reflect the photographer, the camera, the lights, and the surrounding room. A reflection of the photographer in a product ruins the professional look. The AI removes the reflection and fills the area with the product's surface. The reflection is gone. The product looks like it was photographed in a professional light tent — even if it was photographed on your desk.</p>

<p><strong>Category 3: Stray hairs and fibers.</strong> Fabric products (clothing, upholstery, towels) attract stray hairs and fibers. A single hair across a white shirt is the first thing the customer sees. The AI removes the hair and fills the area with the fabric texture. The fabric looks clean. The product looks new.</p>

<p><strong>Category 4: Background distractions.</strong> Power outlets, baseboard edges, scuffs on the backdrop, and shadows from the lighting setup. These are not on the product — they are in the background. But they distract from the product. The AI removes them. The background becomes clean and uniform.</p>

<p><strong>Category 5: Product imperfections.</strong> Small scratches, scuffs, or manufacturing marks on the product itself. Be careful with this category — removing a scratch that is actually present on the product could be misleading if the customer expects a scratch-free product. For catalog photos where the product is representative of what the customer will receive, remove manufacturing defects that are specific to the photographed unit and not present on all units. For the product photo that represents the exact item being sold, do not remove product imperfections — the customer should see what they are buying.</p>

<h2>The Batch Cleanup Workflow</h2>

<p><strong>Step 1: Review all photos at 100% zoom.</strong> Flag every imperfection. This is the most time-consuming step — but it is necessary. An imperfection you miss during review will be visible to the customer.</p>

<p><strong>Step 2: Remove imperfections with the AI object remover.</strong> Process each photo through the <a href="/en/tools/object-remover">object remover</a>. Circle each imperfection. Click remove. The AI fills the area. Process the easy ones first (dust, spots on uniform surfaces). Save the hard ones for last (reflections on complex surfaces, hairs on textured fabrics).</p>

<p><strong>Step 3: Final review at 100% zoom.</strong> Check every removed area. The AI fill should be invisible. If the fill is visible — a blurry patch, a color mismatch, a texture inconsistency — redo the removal with a smaller or larger selection, or manually retouch the area. The goal: the product should look like it was photographed perfectly, not like it was photographed imperfectly and then fixed.</p>

<p>Clean up your product photos at <a href="/en/tools/object-remover">AI object remover</a> — 100 products, 500 imperfections, one afternoon of cleanup. The catalog looks professional. The products sell.</p>`
  },
  {
    slug: "image-description-autonomous-vehicles-self-driving",
    title: "Image Description for Autonomous Vehicles How AI Visual Understanding Is Driving Self-Driving Cars — and Why It Is the Hardest Computer Vision Problem Ever",
    description: "A self-driving car sees a ball roll into the street. A child might follow. The AI must predict this — not just describe what it sees. Here's how AI image understanding enables autonomous driving.",
    date: "2026-07-21",
    category: "Content",
    tags: ["image description", "autonomous vehicles", "self-driving", "computer vision", "safety"],
    relatedTools: ["image-description", "object-remover", "face-blur"],
    content: `<p>A self-driving car approaches a residential street. A ball rolls into the road. The car's AI does not just see "a ball in the road." It predicts: "A child might follow the ball. Slow down. Prepare to stop." The prediction is the difference between an AI that describes what it sees and an AI that <strong>understands</strong> what it sees. The first is an <a href="/en/tools/image-description">image description</a> tool. The second is a safety-critical system operating at highway speeds with human lives at stake.</p>

<p>Autonomous vehicles are the hardest computer vision problem ever attempted. Here is how AI visual understanding enables self-driving — and why the gap between "describe what you see" and "understand what you see" is the difference between a working prototype and a fatal accident.</p>

<h2>Level 1: Perception — "What Is in the Scene?"</h2>

<p>The foundation of autonomous driving is <strong>perception</strong> — identifying the objects in the scene. The car's cameras, LiDAR, and radar feed data to AI models that detect: other vehicles (cars, trucks, buses, motorcycles), pedestrians, cyclists, and animals, road markings (lane lines, crosswalks, stop lines, arrows), traffic signs and signals (speed limits, stop signs, traffic lights), and obstacles (debris, parked cars, construction barriers).</p>

<p>This is the same technology as image description — the AI identifies objects and their positions. But perception alone is not enough. Knowing that there is a pedestrian on the sidewalk is useful. Knowing that the pedestrian is looking at their phone, stepping toward the curb, and not paying attention to traffic — that is the level of understanding required for safe autonomous driving. The gap between perception and understanding is the gap between "there is a pedestrian" and "that pedestrian is about to cross the street without looking."</p>

<h2>Level 2: Prediction — "What Will Happen Next?"</h2>

<p>Prediction is the hardest part of autonomous driving. The AI must anticipate: pedestrian behavior (will that person step into the street?), vehicle behavior (will that car change lanes? run a red light? brake suddenly?), and cyclist behavior (will that cyclist swerve around a pothole?).</p>

<p>The prediction is based on: the object's current trajectory (speed, direction, acceleration), the object's body language (a pedestrian's head orientation, gait, and phone-holding status), and the context (a ball rolling into the street, a bus door opening, a crosswalk with a walk signal). The AI must predict the behavior of every relevant object in the scene — continuously, in real time, at highway speeds. A prediction error at 70 mph is fatal. A prediction error in an image description tool is a funny caption. The stakes could not be more different.</p>

<h2>Level 3: Planning — "What Should the Car Do?"</h2>

<p>Based on the perception and prediction, the car's planning system decides: speed (accelerate, maintain, decelerate, stop), path (stay in lane, change lanes, turn, pull over), and emergency maneuvers (swerve, emergency brake, hazard lights). The planning system must balance safety, legality, and comfort. Stopping abruptly for every detected pedestrian would be safe but unrideable. The car must distinguish between: a pedestrian who is about to cross (brake), a pedestrian who is waiting at a crosswalk (slow down, prepare to brake), and a pedestrian who is walking parallel to the road on the sidewalk (maintain speed).</p>

<p>This is not an image description problem. It is a <strong>decision-making</strong> problem. The image description tells the car what is in the scene. The prediction tells the car what will happen next. The planning system decides what to do about it. The image description is the first step in a chain that ends with a decision that could save or end a life. The <a href="/en/tools/image-description">AI image description</a> tool you use to generate alt text is the same technology — applied to photos of your cat instead of a highway at night. The technology is the same. The stakes are not.</p>`
  },
  {
    slug: "ai-image-generator-vs-background-remover-creation-vs-extraction",
    title: "AI Image Generator vs Background Remover Creation vs Extraction — Two AI Image Tools That Operate in Opposite Directions",
    description: "AI image generator creates a new scene around a subject. Background remover extracts a subject from an existing scene. They are inverse operations — and they work together in the creative pipeline.",
    date: "2026-07-21",
    category: "Generate",
    tags: ["AI image generator", "background remover", "creation", "extraction", "comparison"],
    relatedTools: ["ai-image-generator", "background-remover", "style-transfer"],
    content: `<p>You have a product photo on a cluttered desk. You use a <a href="/en/tools/background-remover">background remover</a> to extract the product onto a transparent background. The tool removed the desk. It kept the product. The operation is <strong>extraction</strong> — removing the context to isolate the subject.</p>

<p>Now you have the isolated product. You want to place it on a lifestyle background — a modern kitchen counter, morning light, coffee cup nearby. You use an <a href="/en/tools/ai-image-generator">AI image generator</a> to create the background. The tool generated a new scene. It added context. The operation is <strong>creation</strong> — generating new content around the subject.</p>

<p>These two tools are <strong>inverse operations</strong> in the creative pipeline. One removes context. The other creates context. They work together — the background remover isolates the subject, and the AI image generator creates a new world around it. Here is the pipeline that uses both.</p>

<h2>Background Remover: The Extraction Tool</h2>

<p>The background remover takes an existing image and removes the background — the context, the environment, everything that is not the subject. The output is the subject on a transparent background. The subject is unchanged. The context is gone. The operation is destructive — the original background is lost. You cannot recover it. Save the original image separately.</p>

<p>Use the background remover when: you need to place a subject on a new background, you need a transparent PNG for design compositing, or you need to isolate a product, person, or object from its original environment.</p>

<h2>AI Image Generator: The Creation Tool</h2>

<p>The AI image generator creates an entirely new image from a text prompt. It can generate: backgrounds (the scene around a subject), complete scenes (subject + background), and abstract or artistic compositions. The output is a new image that did not exist before. The AI generator is the creative engine. The background remover is the isolation tool.</p>

<p>Use the AI image generator when: you need a new background for an extracted subject, you need a complete scene from scratch, or you need creative variations of an existing concept.</p>

<h2>The Creative Pipeline: Extract → Generate → Composite</h2>

<p>The pipeline that uses both tools: extract the subject from the original photo (background remover), generate a new background scene (AI image generator), and composite the extracted subject onto the generated background (any image editor). The result: the subject from the original photo, placed in a completely new, AI-generated environment. The product on the cluttered desk is now the product on a modern kitchen counter. The person in the messy office is now the person in a professional studio. The background remover handled the extraction. The AI image generator handled the creation. The composite is the final image.</p>

<p>Use <a href="/en/tools/background-remover">background remover</a> to extract and <a href="/en/tools/ai-image-generator">AI image generator</a> to create. Extraction and creation. Inverse operations. One creative pipeline.</p>`
  },
  {
    slug: "avatar-generator-history-portraiture-oil-painting-to-ai",
    title: "The History of Portraiture From Oil Paintings to AI Avatars — How Humans Have Been Creating Images of Themselves for 30,000 Years",
    description: "The oldest known portrait is a 30,000-year-old ivory carving of a human head. Today, AI generates a portrait in seconds. The tools changed. The desire to see ourselves represented — never changed.",
    date: "2026-07-21",
    category: "Generate",
    tags: ["avatar generator", "portraiture", "history", "art", "self-representation"],
    relatedTools: ["avatar-generator", "ai-image-generator", "style-transfer"],
    content: `<p>The oldest known portrait is a 30,000-year-old ivory carving — the Venus of Hohle Fels — a small figurine of a woman with exaggerated features. It was carved by a Paleolithic artist using stone tools. It took hours or days to create. It was one of the first times a human being created an image of another human being. The desire to see ourselves represented — to capture a likeness, to preserve a face, to say "I was here" — is one of the oldest human impulses. For 30,000 years, the tools changed. The desire did not.</p>

<p>Today, an <a href="/en/tools/avatar-generator">AI avatar generator</a> creates a portrait in seconds. The tool is different. The impulse is the same. Here is the 30,000-year history of portraiture — from carved ivory to AI-generated avatars.</p>

<h2>30,000 BCE - 1500 CE: The Age of the Elite Portrait</h2>

<p>For most of human history, portraits were reserved for the powerful: Egyptian pharaohs (carved in stone, painted on tomb walls — the portrait was a vessel for the soul in the afterlife), Roman emperors (sculpted in marble, stamped on coins — the portrait was political propaganda), and medieval kings and saints (painted in illuminated manuscripts and church frescoes — the portrait was religious devotion). Ordinary people were not portrayed. The portrait was a privilege of power. If you were not a pharaoh, an emperor, or a saint, your face was never recorded. For 32,000 of the 33,000 years of human image-making, the vast majority of humans who ever lived were never visually represented.</p>

<h2>1500-1900: The Age of the Painter</h2>

<p>The Renaissance democratized portraiture — slightly. Wealthy merchants and nobles commissioned painted portraits. The tools: oil paint on canvas. The time: weeks or months per portrait. The cost: affordable only by the wealthy. Rembrandt painted over 80 self-portraits — a lifelong exploration of his own aging face. The self-portrait became a genre of its own. The portrait was still expensive. It was still time-consuming. But it was no longer reserved for pharaohs and emperors. The rising middle class could afford a portrait. The painter was the photographer of the pre-photography era.</p>

<h2>1840-2000: The Age of the Photograph</h2>

<p>The invention of photography in the 1840s changed everything. A portrait that took weeks to paint could be captured in seconds by a camera. The cost dropped from a painter's commission to the price of a photographic print. For the first time in human history, ordinary people could afford a portrait of themselves. The photographic portrait became: the family photo album, the wedding photograph, the graduation portrait, the passport photo, the school picture. The portrait was no longer a privilege. It was a <strong>right</strong>. Every person could be visually recorded. The camera democratized the portrait.</p>

<h2>2000-Present: The Age of the Selfie and the AI Avatar</h2>

<p>The smartphone camera (2007) and the front-facing camera (2010) made the self-portrait instantaneous and free. The selfie became the most-produced genre of portrait in human history. Over 1 trillion photos are taken every year — the vast majority of them portraits of people. The portrait is no longer a privilege of the powerful, a commission for the wealthy, or even a planned event. It is a daily activity. The question changed from "Can I afford a portrait?" to "Do I want a portrait?" The answer is yes — billions of times per day.</p>

<p>The <a href="/en/tools/avatar-generator">AI avatar generator</a> is the latest tool in this 30,000-year lineage. It does not capture a likeness. It generates one. It is not a photograph. It is a stylized representation. The AI avatar is the portrait of the digital age — not a record of what you look like, but a representation of how you want to be seen. The carved ivory figurine, the oil painting, the photograph, the selfie, the AI avatar — different tools, same impulse. The desire to see ourselves represented. The desire to say "I was here." For 30,000 years, the tools changed. The desire never did.</p>`
  },
];

// Synchronous static accessors"""

content = content.replace(old, new_blogs)

with open(BLOG_FILE, "w", encoding="utf-8") as f:
    f.write(content)

print("AI station: 190->done.")