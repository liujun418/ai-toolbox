"""Add 6 blogs to AI station (335->341 static) - August 18, 2026"""
BLOG_FILE = r"C:\Users\jun\ai-toolbox\src\lib\blog.ts"

with open(BLOG_FILE, "r", encoding="utf-8") as f:
    content = f.read()

old = '\n];\n\n// Synchronous static accessors'

new_blogs = r"""
  {
    slug: "pdf-to-word-accessibility-screen-readers-guide",
    title: "PDF Accessibility: Converting Documents So Screen Readers Can Actually Read Them",
    description: "A scanned PDF is a picture of words to a screen reader. Converting it to an accessible document changes who can use it — here's the workflow for accessible PDF conversion.",
    date: "2026-08-18",
    category: "Document",
    tags: ["pdf accessibility", "pdf to word", "screen reader", "accessible documents", "ocr documents"],
    relatedTools: ["pdf-to-word", "text-polish", "image-description"],
    content: `<p>You send a colleague a PDF with the training schedule. They reply, politely, that they can't read it. Not "won't" — can't. They use a screen reader, and the PDF is a stack of scanned images with no text layer. To assistive technology, your document is a picture of words. Converting it to an accessible format is the difference between a document that exists and a document that works.</p>

<h2>Why PDFs Fail Screen Readers</h2>

<p>A screen reader reads text, not pixels. If a PDF was created from typed text with proper tags, assistive tools can usually navigate it. If it was scanned, emailed, or flattened, the document contains an image of every page and nothing else. A <a href="/en/tools/pdf-to-word">PDF to Word converter</a> that runs OCR first gives that PDF a real text layer — the single biggest accessibility improvement you can make to a legacy document.</p>

<h2>The Conversion Workflow</h2>

<p>Convert, then verify, then clean. Step 1: convert the scanned PDF so the text is extractable. Step 2: open the result and confirm the reading order is logical — OCR on a two-column page often scrambles columns, and a screen reader announces sentences in the wrong sequence. Step 3: fix heading structure and alt text. That last part matters most: a document with proper headings is a document a screen reader user can navigate the way you skim. The <a href="/en/tools/text-polish">text polish</a> tool cleans up the run-on sentences OCR loves to produce, and the <a href="/en/tools/image-description">image description</a> tool writes alt text for any figure that needs one.</p>

<h2>The Counter-Intuitive Part</h2>

<p>Accessibility is not a lossy compromise — it improves the document for everyone. The same text layer that helps a screen reader makes the document searchable, copyable, and translatable. The common mistake is treating an "accessible version" as a separate deliverable you'll get to someday. Convert the source once, keep it accessible, and the PDF stops being a wall.</p>

<p>Why extracting text from PDFs stayed hard for three decades is covered in our guide to <a href="/en/blog/pdf-to-word-hidden-complexity-30-years">the hidden complexity of PDF</a>. A document no one can read isn't a document — it's a formality. Convert it, verify it, and let everyone in.</p>`
  },
  {
    slug: "watermark-remover-camera-timestamp-date-stamp-guide",
    title: "Removing Date Stamps and Timestamps From Photos: The Marks Your Camera Added",
    description: "Your camera burned the date into the corner of every photo — and on half of them it's wrong. Here's how to remove date stamps and timestamps cleanly, and when to keep them.",
    date: "2026-08-18",
    category: "Edit",
    tags: ["date stamp", "remove timestamp", "camera watermark", "photo cleanup", "watermark remover"],
    relatedTools: ["watermark-remover", "photo-restorer", "object-remover"],
    content: `<p>You find the box of family photos from 1998 and every single one has a glowing orange date burned into the corner. Somewhere in there is a real memory, partially covered by a stamp your camera decided you couldn't live without. Worse, on half the photos the date is wrong. Removing that stamp is a classic AI edit job — but the technique depends on what's under it.</p>

<h2>The Date Stamp Problem</h2>

<p>Date stamps and timestamps sit on top of the image like a watermark, and unlike a logo, they're usually placed over content — a sky, a wall, a face, a table full of cake. A simple crop works only when the stamp sits in a blank corner. The <a href="/en/tools/watermark-remover">watermark remover</a> tool handles the common case: a small region it can reconstruct from the surrounding pixels. The common mistake is cropping into the photo to hide the stamp and losing part of the scene forever.</p>

<h2>When Removal Works Cleanly</h2>

<p>The counter-intuitive part: the more consistent the background behind the stamp, the better the reconstruction. A date over an empty sky or a plain wall is nearly invisible after removal; a date over a busy pattern of leaves is a gamble. Run the removal and zoom in — a clean result leaves no edge, no smear, and no ghost of the digits. If the photo itself is old and worn, pair the removal with the <a href="/en/tools/photo-restorer">photo restorer</a> to fix scratches and fading in the same pass.</p>

<h2>When You Should Keep It</h2>

<p>Not every timestamp deserves to die. On a scanned document, a receipt, or a signed form, the date is evidence — removing it changes the meaning. On a genuine historical record, the stamp is part of the artifact. And when the thing in the way is bigger than a stamp, the <a href="/en/tools/object-remover">object remover</a> is the right call. For a corner date on a personal photo, targeted watermark removal is usually enough.</p>

<p>We covered general photo mark cleanup in our guide to <a href="/en/blog/watermark-remover-image-cleanup-guide">AI watermark removal for image cleanup</a>. The date stamp is the watermark you never chose. Remove it cleanly, keep it when it's evidence, and get the real photo back.</p>`
  },
  {
    slug: "text-to-speech-kids-bedtime-stories-guide",
    title: "Using Text to Speech for Kids' Bedtime Stories: Voices, Pacing, and When a Human Voice Wins",
    description: "A bedtime story at the right pace ends a day; the wrong one restarts it. Here's how to use text to speech for children's stories — voice choice, speed, and the limits.",
    date: "2026-08-18",
    category: "Content",
    tags: ["text to speech", "bedtime stories", "kids audiobooks", "tts for kids", "story time"],
    relatedTools: ["text-to-speech", "article-generator", "text-polish"],
    content: `<p>It's 8:47 p.m. and the child who was supposed to be asleep at 8:30 has an urgent request: a story. You've read the same book forty-one times. A text to speech voice could take over — but a bedtime story is not a lecture. Get the voice, speed, and pacing wrong and you've produced a lullaby that wakes everyone up.</p>

<h2>Voice and Pacing Matter More Than You Think</h2>

<p>The voice you'd choose for a work narration — crisp, neutral, fast — is wrong for a bedroom. A good <a href="/en/tools/text-to-speech">text to speech</a> tool lets you slow the rate, and slower is not just softer, it's clearer: at a relaxed pace a child can follow the story instead of chasing it. Pick a warm-sounding voice if the tool offers choices, and keep the volume low. The common mistake is treating TTS like a podcast — energetic, quick — and turning a wind-down into a warm-up.</p>

<h2>How to Set Up a Story Session</h2>

<p>Keep stories short, with clear beats. A two-page picture book text is ideal; a 4,000-word chapter is a marathon that ends in "one more chapter." Read the story aloud once to find the natural pauses, then let the tool follow them — short sentences make synthetic speech sound human. If you're out of books, the <a href="/en/tools/article-generator">article generator</a> can draft a simple original story, and the <a href="/en/tools/text-polish">text polish</a> tool smooths the sentences so the voice reads them naturally.</p>

<h2>The Limits: When the Human Voice Wins</h2>

<p>The counter-intuitive part: a synthetic voice is often great at the story and helpless at the ritual. The questions — "why is the bear sad?", "what happens tomorrow?" — are the actual bedtime experience, and no TTS can answer them. Use the voice for the reading; stay in the room for the conversation. The narration can be perfect and the moment still needs you.</p>

<p>We covered producing full audio chapters from articles in our guide to <a href="/en/blog/tts-audiobook-production-articles-to-audio">TTS audiobook production</a>. A bedtime story isn't a production, it's a pace. Slow it down, keep it short, and let the voice read while you stay for the questions.</p>`
  },
  {
    slug: "object-remover-vs-face-blur-people-in-photos-guide",
    title: "Removing People vs Blurring Faces: Which Photo Tool Should You Reach For?",
    description: "A stranger walked into your travel photo. Do you remove them or blur them? AI object removal and face blur solve different problems — here's how to choose.",
    date: "2026-08-18",
    category: "Edit",
    tags: ["object remover", "face blur", "remove people from photos", "photo privacy", "photo editing"],
    relatedTools: ["object-remover", "face-blur", "background-remover"],
    content: `<p>You came home from vacation with a perfect photo of a street in Lisbon — and a stranger standing directly in the middle of it. Now you have a choice: remove the person entirely, or keep them in the scene but hide their face. Both are one click in modern AI tools, but they answer completely different questions, and picking wrong can turn a cleanup into an ethical problem.</p>

<h2>Removal: When the Person Has No Business Being There</h2>

<p>Use the <a href="/en/tools/object-remover">object remover</a> when the person is accidental — a passerby, a tourist, a photobomb — and removing them restores the scene you actually wanted. The AI reconstructs the background where they stood, which works beautifully when the backdrop is repeatable (a sidewalk, a wall, a street) and struggles when the person was standing in front of something unique. The common mistake is using removal on someone whose presence you're trying to hide, like a colleague at a work event — that's not a cleanup, it's a deletion with intent.</p>

<h2>Blurring: When the Person Stays but Their Identity Doesn't</h2>

<p>Use <a href="/en/tools/face-blur">face blur</a> when the person is legitimately part of the scene — a crowd at a market, a participant in a group photo — but you shouldn't publish their identity. Blur keeps the context and removes the identification. This is the privacy default for real-world photography: streets, events, schools, workplaces. The counter-intuitive part: blurring a face keeps the photo honest about the moment, while removal rewrites what happened.</p>

<h2>The Middle Ground</h2>

<p>Not every stranger needs either treatment. A figure far in the background is often unidentifiable and can stay. And when the whole scene needs its context stripped, the <a href="/en/tools/background-remover">background remover</a> handles a different job entirely — isolating the subject instead of editing who's around them.</p>

<p>We compared removal and anonymization in our guide to <a href="/en/blog/object-remover-vs-face-blur-remove-vs-anonymize">object remover vs face blur</a>. Ask the question before you click: is this person noise to remove, or context to keep? The right tool follows the answer.</p>`
  },
  {
    slug: "avatar-generator-author-press-kit-guide",
    title: "Authors and Creators: Build a Consistent Avatar for Your Press Kit and Social Profiles",
    description: "One author photo, six platforms, three books — and a brand. Here's how to generate a consistent author avatar for press kits, book jackets, and social profiles.",
    date: "2026-08-18",
    category: "Generate",
    tags: ["avatar generator", "author photo", "press kit", "personal brand", "creator avatar"],
    relatedTools: ["avatar-generator", "ai-image-generator", "style-transfer"],
    content: `<p>You're a writer with a book coming out. Your publisher needs an author photo for the jacket, a headshot for the press kit, a profile image for the events page, and a thumbnail for your newsletter — and every one of them should look like the same person. You have one decent photo and no budget for a shoot. This is exactly the problem a consistent avatar workflow solves.</p>

<h2>The Consistency Problem</h2>

<p>An <a href="/en/tools/avatar-generator">avatar generator</a> is great at producing a flattering portrait and terrible at producing the same face twice if you don't anchor it. The common mistake is generating one image, loving it, and then discovering the second generation is a cousin instead of you. The fix is the same as for any AI portrait: start from a single reference photo, keep the prompt identical, and lock the seed when the tool offers one. Generate the whole set in one session, not across three separate moods.</p>

<h2>Building the Press Kit Set</h2>

<p>Now vary only what needs to vary. One neutral headshot for the jacket, one smiling version for the press kit, one casual version for social — change the expression, keep everything else fixed. If you need a scene or a specific background, generate that version with the <a href="/en/tools/ai-image-generator">AI image generator</a> using the avatar as the reference, and the <a href="/en/tools/style-transfer">style transfer</a> tool imposes the same aesthetic across the whole set. The result is a brand: every platform shows the same face, same tone, same person.</p>

<h2>The Trust Question</h2>

<p>The counter-intuitive part: an author photo is not just marketing, it's a promise about the person who wrote the book. An avatar that looks obviously AI-generated — airbrushed skin, a face that can't be pinned down — undermines trust before anyone reads a page. Keep the avatar close to your real appearance, and if the platform or the audience values honesty over polish (a memoir, a personal essay), consider the real photo. The tools are there to make you consistent, not to make you up.</p>

<p>We covered consistent headshots for professional profiles in our guide to <a href="/en/blog/avatar-generator-professional-profile-headshots-linkedin">AI headshots for professional profiles</a>. One reference, one prompt, one session — and the press kit looks like a single person from every angle.</p>`
  },
  {
    slug: "article-generator-hallucination-fact-checking-guide",
    title: "When AI Articles Make Things Up: Why Hallucination Happens and How to Fact-Check",
    description: "Your AI article confidently cited a study that doesn't exist. Hallucination isn't a bug you can prompt away — here's why it happens and the fact-checking workflow that catches it.",
    date: "2026-08-18",
    category: "Content",
    tags: ["article generator", "ai hallucination", "fact checking", "ai writing", "ai accuracy"],
    relatedTools: ["article-generator", "text-polish", "text-to-speech"],
    content: `<p>You asked an AI to draft a section about workplace surveys. It produced four solid paragraphs and one citation: a journal, a year, two author names. It sounds real. It's not — that study does not exist. This is hallucination, the model confidently fabricating, and it's the single most dangerous failure mode in AI writing, because the fake thing is dressed like a real thing.</p>

<h2>Why Models Hallucinate</h2>

<p>An <a href="/en/tools/article-generator">article generator</a> doesn't retrieve facts; it predicts the next likely word. When the training data doesn't include the answer, the model doesn't say "I don't know" — it produces the most plausible-sounding string it can. That's why hallucinated citations look perfect: the model has seen thousands of real ones and learned their shape. The counter-intuitive part: adding "be accurate" to the prompt changes nothing, because the model was already trying to be accurate. Confident prompting doesn't reduce hallucination — verification does.</p>

<h2>The Fact-Checking Workflow</h2>

<p>Every AI draft gets a verification pass before it's published. Step 1: flag every specific claim — names, dates, numbers, citations — and check each one against a source you can open. A citation you can't find is a citation that doesn't exist. Step 2: read the draft out loud; the <a href="/en/tools/text-to-speech">text to speech</a> tool catches claims that sound confident but say nothing. Step 3: rewrite the unverifiable sentences in your own words with the <a href="/en/tools/text-polish">text polish</a> tool, or cut them. The workflow isn't optional — it's the part of the job the model can't do.</p>

<h2>The Roles AI Can Safely Play</h2>

<p>Hallucination is manageable when you know the material and fatal when you don't. Use AI for structure, phrasing, and synthesis of facts you provide; don't use it as a search engine. If a draft makes a claim that surprises you, treat the surprise as the alarm it is — the same reflex we covered in our guide to <a href="/en/blog/article-generator-edit-ai-drafts-human">turning AI drafts into human writing</a>. Verify before you publish, and the confident lie never reaches a reader.</p>`
  },
];

// Synchronous static accessors"""

content = content.replace(old, new_blogs)

with open(BLOG_FILE, "w", encoding="utf-8", newline="\n") as f:
    f.write(content)

print("AI station: 335->341 static objects done.")
