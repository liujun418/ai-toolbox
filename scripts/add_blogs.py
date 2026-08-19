"""Add 6 blogs to AI station (341->347 static) - August 19, 2026"""
BLOG_FILE = r"C:\Users\jun\ai-toolbox\src\lib\blog.ts"

with open(BLOG_FILE, "r", encoding="utf-8") as f:
    content = f.read()

old = '\n];\n\n// Synchronous static accessors'

new_blogs = r"""
  {
    slug: "pdf-to-word-tables-formatting-fix-guide",
    title: "Why Tables Break When You Convert PDF to Word (and How to Fix Them)",
    description: "Columns drift, headers repeat, numbers become text. Table-heavy PDFs are the hardest conversion job. Here's what happens and how to get usable spreadsheets out.",
    date: "2026-08-19",
    category: "Document",
    tags: ["pdf tables", "table extraction", "pdf to word", "spreadsheet", "data extraction"],
    relatedTools: ["pdf-to-word", "text-polish", "image-description"],
    content: `<p>It's the first of the month, and the finance report just arrived as a PDF. Twelve columns: account, client, region, three cost lines, four forecast columns. You convert it to Word, and what comes back is a disaster — the header row repeats on page three, a column split into two, and the numbers that were once aligned under "Total" are now floating after the client name. Converting a table-heavy PDF is a different job than converting a text page, and knowing why is the difference between a salvageable file and a rebuild.</p>

<h2>Why Tables Are the Hardest Part of a PDF</h2>

<p>A PDF stores a table as lines and positioned text, not as rows and cells. Text extraction sees words and coordinates; the structure — which cell belongs to which column — has to be reconstructed. When a table has merged cells, split columns, or text that wraps, the reconstruction guesses, and the guess shows up as a misplaced decimal or a header that belongs to the row above. This is why a <a href="/en/tools/pdf-to-word">PDF to Word converter</a> handles a letter page flawlessly and stumbles on a dense budget sheet.</p>

<h2>The Fixes That Actually Work</h2>

<p>Convert, then treat the result as a draft, not a deliverable. First, check the header row: if it repeated or shifted, select the rows and set them as a repeating header again. Second, reconcile the columns — a converter often splits one column into two when the text was close together; merging them back is usually enough. Third, and most importantly, check the numbers: text extraction can turn a figure into "12.3 0" or drop the trailing zero. Run the table through a clean-up pass with the <a href="/en/tools/text-polish">text polish</a> tool for the wording, and read the figures column by column before you trust them.</p>

<h2>When the Table Won't Convert</h2>

<p>The counter-intuitive part: sometimes the smartest move is not to convert the table at all. If the table is a scanned image with no text layer, no converter can rebuild the columns reliably — it's guessing from pixels. If the table is deeply formatted (colored cells, merged blocks, cross-row totals), the reconstruction cost outweighs the retyping cost. And if the layout is beyond saving, the <a href="/en/tools/image-description">image description</a> tool can at least turn the figure into readable content while you rebuild the structure.</p>

<p>We covered why converted documents look wrong in our guide to <a href="/en/blog/pdf-to-word-formatting-survival-guide">PDF to Word formatting</a>. Tables fail because the structure is a guess, not because the tool is broken. Convert, verify the columns, read the numbers — and the monthly report stops being a Monday project.</p>`
  },
  {
    slug: "face-blur-license-plate-vehicle-privacy-guide",
    title: "Blurring License Plates in Photos and Video: Vehicle Privacy Beyond Faces",
    description: "A parked car with a visible plate is a data trail. Here's how to blur license plates — and why your car's privacy often matters more than your face's.",
    date: "2026-08-19",
    category: "Edit",
    tags: ["license plate blur", "vehicle privacy", "face blur", "photo privacy", "anonymize"],
    relatedTools: ["face-blur", "object-remover", "background-remover"],
    content: `<p>You're selling your car, so you take a photo of it in the driveway and post it to a marketplace. The plate is perfectly legible. In the background, the neighbors' cars are visible too, plates included. A few days later you realize what you handed out: your plate number, your neighbors' plate numbers, your address, and a timestamp — packaged as a single image that anyone can download. Faces blur easily. License plates are the privacy leak nobody thinks about.</p>

<h2>Why Plates Are a Privacy Problem</h2>

<p>A license plate is a public identifier tied to a person. Run a plate through the right lookup and you can find registration details, addresses, and a vehicle's history. That's why rental listings, sale ads, and social posts blur them. The <a href="/en/tools/face-blur">face blur</a> tool handles this as easily as it handles a face — the same anonymization applies to the metal rectangle on the bumper.</p>

<h2>Blur vs Remove: Which Is Right</h2>

<p>Here's the decision the <a href="/en/tools/object-remover">object remover</a> helps with. If the plate is incidental — a background car in a street shot — blurring keeps the scene intact while removing the identifier. If the plate is the subject (you're selling the car, the ad is about the car), you might remove it entirely so the image is clean. Blur keeps context, removal changes the image; the ethical default is to blur what you must hide and leave the scene alone.</p>

<h2>The Counter-Intuitive Part</h2>

<p>Plates are often easier to hide than faces — and far more legally sensitive. A blurred face is usually a courtesy; a visible plate can be a compliance problem, especially in photos used commercially or for listings, and on public roads where the <a href="/en/tools/background-remover">background remover</a> might strip the whole scene anyway. Also remember: a blur that's too light is a blur AI can undo — use a strong blur or a solid block, not a pixel-thin smudge.</p>

<p>We covered the legal side of street photography in our guide to <a href="/en/blog/face-blur-street-photography-legal-guide">face blur for street photography</a>. Your face is one identifier; your plates are another. Blur the plates, keep the scene, and the photo you share stops leaking the things you didn't mean to share.</p>`
  },
  {
    slug: "colorizer-vs-color-grading-accuracy-aesthetic",
    title: "AI Colorizer vs Color Grading: Accuracy vs Aesthetic in Film and Photography",
    description: "Colorizing an old photo tries to reconstruct what was there; color grading decides how a shot should feel. Same palette, opposite goals.",
    date: "2026-08-19",
    category: "Edit",
    tags: ["colorizer", "color grading", "AI colorization", "film color", "photo editing"],
    relatedTools: ["colorizer", "photo-restorer", "style-transfer"],
    content: `<p>You find a black-and-white photo of your grandfather's café in 1962. One tool colorizes it, adding believable reds to the sign and skin tones to the faces. Another tool lets you "grade" it — shifting the whole image toward warm amber, making the same café feel nostalgic. Both operate on the same pixels. Both change what you see. But they are solving opposite problems, and mixing them up produces images that are neither accurate nor aesthetic.</p>

<h2>Colorizer: Reconstructing the Past</h2>

<p>The <a href="/en/tools/colorizer">AI colorizer</a> is a reconstruction machine. It reads grayscale values and predicts the colors that were probably there — skin, sky, signage — using patterns learned from millions of color photos. Its goal is accuracy, or as close as an algorithm can get. The common mistake is treating a colorized photo as historical truth; the colors are confident guesses, not recordings. That's fine for a family album and dangerous for a documentary.</p>

<h2>Color Grading: Directing Emotion</h2>

<p>Color grading is not about what was there; it's about how you want the viewer to feel. A teal-and-orange grade on a street shot signals action. A desaturated, cool grade signals grief. Every film and most photography do this deliberately — the palette is a directorial choice. The <a href="/en/tools/style-transfer">style transfer</a> tool lives in the same neighborhood: it imposes an aesthetic across an image rather than recovering one. Where the colorizer answers "what color was this?", grading answers "what should this image communicate?"</p>

<h2>Which One Is Your Job</h2>

<p>The counter-intuitive part: the two tools are complementary, and the pipeline matters. Restore first, then decide. A damaged black-and-white photo should be repaired with the <a href="/en/tools/photo-restorer">photo restorer</a>, colorized for accuracy if that's the goal, then graded only if you want the final image to carry an emotional direction. Colorize for truth, grade for mood — and know which one you're doing before you touch the slider.</p>

<p>We covered the restoration pipeline order in our guide to <a href="/en/blog/colorizer-vs-photo-restorer-which-first">colorizer vs photo restorer</a>. A colorized café is a reconstruction; a graded café is a statement. Pick the tool by the question you're answering.</p>`
  },
  {
    slug: "text-to-speech-meditation-mindfulness-audio-guide",
    title: "Text to Speech for Guided Meditation: Building a Calm Voice Library",
    description: "A meditation track needs a voice that never rushes. Here's how to use text to speech to build guided meditations and mindfulness audio that actually relax.",
    date: "2026-08-19",
    category: "Content",
    tags: ["text to speech", "meditation audio", "guided meditation", "mindfulness", "calm voice"],
    relatedTools: ["text-to-speech", "article-generator", "text-polish"],
    content: `<p>You keep a journal, you've been meditating on and off for two years, and you want to record your own guided sessions. Your voice feels wrong for it, and a studio is out of the question. So you load your script into a text to speech tool, expecting a robot. Instead you get a voice that doesn't rush, doesn't yawn, and doesn't judge. The obstacle isn't the technology — it's writing a script that a synthetic voice can turn into calm.</p>

<h2>What a Meditation Voice Needs</h2>

<p>A good meditation track runs at a pace that feels slow on purpose. The <a href="/en/tools/text-to-speech">text to speech</a> tool gives you control over that pace, and slowing it down is not just stylistic — it's structural. The voice needs to drop to a near-monotone on the instructions and soften on the prompts to breathe. The common mistake is writing meditation scripts the way you'd write blog posts: dense sentences, vivid words, information. A meditation script is mostly pauses wearing words.</p>

<h2>Scripting for Slow Delivery</h2>

<p>Write short lines and let the silence work. "Breathe in. Feel the air at the top of your lungs. Breathe out. Feel your shoulders drop." The <a href="/en/tools/text-polish">text polish</a> tool helps strip the script to its essentials — every word that doesn't earn its place is a word that breaks the calm. Use the <a href="/en/tools/article-generator">article generator</a> if you need a starting draft: ask it to write a ten-minute body-scan script, then slow it down by hand. The counter-intuitive part is that simpler text produces the better track.</p>

<h2>The Limits of the Voice</h2>

<p>The voice can carry the instructions, but it can't do the listening. A session is a relationship: the guide notices, responds, adapts. A static track can't answer "what if my mind won't stop?" — so structure the script to handle the most common interruptions, then accept that the recording is a floor, not the whole practice. The best use of TTS here is production, not presence: build the track, and let the presence come from the person pressing play.</p>

<p>We covered how your brain processes synthetic voices in our guide to <a href="/en/blog/text-to-speech-brain-neuroscience-synthetic-vs-human-voice-processing">the neuroscience of synthetic voices</a>. Slow it down, strip the words, leave the pauses — and the voice that never rushes becomes the calmest part of the session.</p>`
  },
  {
    slug: "avatar-generator-tabletop-rpg-character-portraits-guide",
    title: "Avatar Generator for Tabletop RPG Characters: Bringing Your Character Sheet to Life",
    description: "Your D&D character has a backstory but no face. Here's how to generate a character portrait that matches the sheet — class, vibe, and style consistent.",
    date: "2026-08-19",
    category: "Generate",
    tags: ["avatar generator", "tabletop RPG", "D&D character", "character portrait", "dungeons and dragons"],
    relatedTools: ["avatar-generator", "ai-image-generator", "style-transfer"],
    content: `<p>Session zero of your new campaign. The dungeon master hands you a character sheet: a tiefling bard with a stolen lute, a talent for lying, and a tragic backstory about a burned-down theater. The sheet is full of numbers and a blank square where the portrait should be. You want a face for this character — the kind that makes the table gasp when you flip the card. An avatar generator can do it, if you feed it the right brief.</p>

<h2>Building the Character Brief</h2>

<p>Before you generate, write the portrait brief like a casting call: species and class (tiefling bard), style (fantasy oil painting), palette (deep purple and gold), expression (charming, a little dangerous), and one telling detail (a silver earring, the stolen lute). The <a href="/en/tools/avatar-generator">avatar generator</a> needs those specifics; a prompt that says "fantasy character" returns a generic hero. The common mistake is describing the mood without describing the features — the machine can't know your character's violet eyes unless you say so.</p>

<h2>Generating the Portrait</h2>

<p>One reference image of the style you want goes a long way. Lock the composition — head and shoulders, centered — and generate a few variants, then pick the one that matches the sheet. The <a href="/en/tools/ai-image-generator">AI image generator</a> is the bigger tool if you need a full scene (the bard on stage, fire behind him), while the avatar generator handles the portrait itself. If you want a consistent look across the whole party — same painter, same palette — the <a href="/en/tools/style-transfer">style transfer</a> tool can unify the set afterward.</p>

<h2>The Consistency Trap</h2>

<p>The counter-intuitive part: the hardest part isn't making the portrait, it's keeping it the same character. Generate the portrait, the token, and the scene in one session, from the same brief, with the same reference — otherwise your bard's face drifts into a cousin's. And remember the sheet: the portrait should look like the character, not like a cool image that happens to be attached to your name. A portrait that matches the numbers is a character the table can believe in.</p>

<p>We covered keeping an AI portrait consistent in our guide to <a href="/en/blog/avatar-generator-likeness-stability-guide">avatar likeness stability</a>. Write the brief, lock the style, generate the set — and the blank square on your sheet becomes the character the table remembers.</p>`
  },
  {
    slug: "image-description-dating-profile-photos-guide",
    title: "Image Description for Dating Profile Photos: What Your Photos Say About You",
    description: "Your profile pictures are being read like captions — by apps, by bots, and by people. Here's what image description reveals about how others see you.",
    date: "2026-08-19",
    category: "Content",
    tags: ["image description", "dating profile", "photo analysis", "alt text", "first impressions"],
    relatedTools: ["image-description", "avatar-generator", "background-remover"],
    content: `<p>You're updating your dating profile and a friend suggests an experiment: run one of your photos through an image description tool and see what a machine says about it. You choose the one you thought was good — you at a rooftop party, glass in hand, laughing. The tool returns: "A young man at a crowded rooftop party in the evening, holding a drink, smiling at someone off-camera. The background is dark and the lighting is low." You stare at it. The model just described your photo the way a stranger would see it. And strangers are exactly who's looking.</p>

<h2>What the Model Sees Is What Others See</h2>

<p>An <a href="/en/tools/image-description">image description</a> tool doesn't judge; it reports. "Dark background. Low lighting. Crowd. You're smiling at someone out of frame." Every element it lists is an element a real person scanning your profile registers in a second and a half. The description is a checklist of first impressions, and it's usually more honest than your own read of the photo, because you're not describing the photo — you're describing the memory.</p>

<h2>Why the Description Matters</h2>

<p>The counter-intuitive part: a dating profile photo is a caption whether you write one or not. People infer from the pixels — the kind of events you attend, whether you're a group person, whether you look approachable. A description that says "dimly lit bar, hard to see your face" tells you why that photo keeps getting ignored even though you look good in it. A description that says "bright daylight, you're clearly visible, relaxed posture, genuine smile" is the photo that does the work.</p>

<h2>Using It to Improve Your Profile</h2>

<p>Run all your candidates, then act on the report. Replace the dark group shot with one the model reads as "bright, warm, you at the center." Swap a photo where the description mentions a distracting background for one where the subject is clearly you — the <a href="/en/tools/background-remover">background remover</a> can clean up the noise if the photo is otherwise good. And if you want consistency across your set, the <a href="/en/tools/avatar-generator">avatar generator</a> produces portraits with a uniform look. Your profile isn't judged by your best memory of a photo; it's judged by what a stranger's eyes and an algorithm's words actually find in it.</p>

<p>We covered how AI describes images for accessibility in our guide to <a href="/en/blog/image-description-ai-accessibility-visually-impaired-users">AI image description</a>. The same technology that writes alt text can read your dating profile back to you. Listen to what it says — the photo you love may not be the photo that works.</p>`
  },
];

// Synchronous static accessors"""

content = content.replace(old, new_blogs)

with open(BLOG_FILE, "w", encoding="utf-8", newline="\n") as f:
    f.write(content)

print("AI station: 341->347 static objects done.")
