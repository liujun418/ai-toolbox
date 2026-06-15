const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://ai-toolbox-api-production.up.railway.app";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  image?: string;
  content: string;
  relatedTools?: string[];
}

interface ApiBlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string; // comma-separated
  related_tools: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

function apiToBlogPost(api: ApiBlogPost): BlogPost {
  return {
    slug: api.slug,
    title: api.title,
    description: api.description,
    date: api.created_at?.slice(0, 10) || "",
    category: api.category,
    tags: api.tags ? api.tags.split(",").map(s => s.trim()).filter(Boolean) : [],
    content: api.content,
    relatedTools: api.related_tools ? api.related_tools.split(",").map(s => s.trim()).filter(Boolean) : [],
  };
}

// Static posts kept as fallback when API is unreachable
export const blogPosts: BlogPost[] = [
  {
    slug: "ai-image-generator-blog-featured-images",
    title: "How to Create Blog Featured Images in 30 Seconds with AI",
    description: "Stop paying for stock photos. Create unique featured images for your blog posts in 30 seconds with AI. Custom aspect ratios, styles, and quality levels.",
    date: "2026-06-15",
    category: "Image Generation",
    tags: ["AI image generator", "featured images", "blog images", "stock photo alternative", "AI art"],
    relatedTools: ["ai-image-generator"],
    content: `
<p>I used to spend 10 minutes searching for a stock photo for every blog post. Most were either too expensive, didn't match the content, or had a generic look. Then I started using an <a href="/en/tools/ai-image-generator">AI image generator</a> — now I create unique featured images in 30 seconds.</p>

<h2>What Makes a Good Featured Image</h2>

<p>A featured image should be:
<ul>
  <li>Relevant to your post's content</li>
  <li>Visually appealing</li>
  <li>High-quality (at least 1200x630 pixels)</li>
  <li>Unique — not a stock photo everyone else uses</li>
</ul>

An <a href="/en/tools/ai-image-generator">AI image generator</a> checks all these boxes. You describe what you want, and it creates an image from scratch.</p>

<h2>The 30-Second Workflow</h2>

<p>Here's how I create every featured image:</p>

<h3>1. Choose the Right Aspect Ratio</h3>

<p>Blog posts need a 1200x630 (16:9) aspect ratio. Our <a href="/en/tools/ai-image-generator">AI image generator</a> supports four aspect ratios: square (1:1), landscape (16:9), portrait (9:16), and wide (21:9). For featured images, I always pick 16:9.</p>

<h3>2. Write a Specific Prompt</h3>

<p>The more specific your prompt, the better the result. Instead of "a cat," try "a golden retriever puppy sitting on a wooden dock at sunset, photorealistic, warm lighting, shallow depth of field."</p>

<p>I use a template: [Subject] + [Location] + [Style] + [Details]. This gives the AI all the information it needs to create a relevant image.</p>

<h3>3. Generate and Download</h3>

<p>Click "Generate Image" and wait 30 seconds. The AI uses SDXL to create a high-quality image. Download the PNG file and upload it to your blog.</p>

<h2>The Style That Gets Clicks</h2>

<p>I experimented with different styles and found that <strong>photorealistic</strong> images get the most clicks. They look like real photos, not AI-generated art. For tutorials, I use "cinematic lighting" or "3D render" styles for a professional look.</p>

<h2>Why AI Beats Stock Photos</h2>

<p><strong>Cost.</strong> Stock photos cost $5-20 per image. AI-generated images cost 2-7 credits, which is about $0.60-2.10 per image.</p>

<p><strong>Uniqueness.</strong> No one else has your AI-generated image. Stock photos are used by thousands of websites.</p>

<p><strong>Relevance.</strong> You can describe exactly what you need. Stock photos are often a compromise.</p>

<h2>Try It Yourself</h2>

<p>Ready to create your own featured images? <a href="/en/signup">Sign up for a free account</a> and get 5 credits to try the <a href="/en/tools/ai-image-generator">AI image generator</a>. No credit card required. Create your first featured image in 30 seconds.</p>
`,
  },

  {
    slug: "how-to-remove-image-background-without-photoshop",
    title: "How to Remove Image Background Without Photoshop — 3 Free AI Methods",
    description: "Learn three free ways to remove image backgrounds without Photoshop. Compare manual editing, online tools, and AI-powered background removers for the best results.",
    date: "2026-05-19",
    category: "Image Editing",
    tags: ["remove background", "background remover", "AI background removal", "free Photoshop alternative"],
    relatedTools: ["background-remover", "object-remover"],
    content: `<p>Removing the background from an image used to mean spending hours with Photoshop's pen tool or paying a designer. Today, AI-powered background removers can do the job in seconds — no design skills required. In this guide, we'll compare three methods and help you choose the best one for your needs.</p>

<h2>Method 1: AI Background Remover (Fastest)</h2>
<p>The fastest way to remove backgrounds is using an <strong>AI-powered background remover tool</strong>. These tools use deep learning models trained on millions of images to detect foreground subjects and separate them from backgrounds automatically.</p>
<p>Our <a href="/en/tools/background-remover">free background remover</a> uses BRIA RMBG, a state-of-the-art model that handles complex edges like hair, fur, and transparent objects. Just upload your image and get a transparent PNG in seconds.</p>
<p><strong>Best for:</strong> E-commerce product photos, profile pictures, social media content, quick edits.</p>
<p><strong>Limitations:</strong> Complex images with multiple subjects may need manual touch-up.</p>

<h2>Method 2: Manual Keep Mode (Precise Control)</h2>
<p>When automatic detection isn't enough, manual background removal gives you pixel-level control. Our tool's <strong>Manual Keep mode</strong> lets you paint green strokes on areas you want to preserve. The AI processes only your selected regions for precise results.</p>
<p>This is ideal for images with: transparent objects, fine hair details, multiple overlapping subjects, or when you need to keep specific background elements.</p>

<h2>Method 3: Traditional Manual Editing</h2>
<p>Before AI tools, removing backgrounds meant using Photoshop's selection tools: Magic Wand, Quick Selection, Pen Tool, or Layer Masks. While these give full control, they require significant time and skill. A complex product photo can take 20-30 minutes manually versus 2 seconds with AI.</p>
<p><strong>When to still use manual editing:</strong> Ultra-high-resolution print work, images requiring perfect pixel-level precision, or when you need to edit the subject itself.</p>

<h2>Comparing the Methods</h2>
<table>
<tr><th>Method</th><th>Speed</th><th>Quality</th><th>Skill Needed</th><th>Cost</th></tr>
<tr><td>AI Auto</td><td>~2 seconds</td><td>Excellent</td><td>None</td><td>2 credits</td></tr>
<tr><td>AI Manual Keep</td><td>~30 seconds</td><td>Perfect</td><td>Minimal</td><td>2 credits</td></tr>
<tr><td>Photoshop Manual</td><td>20-30 min</td><td>Perfect</td><td>Professional</td><td>$20+/month</td></tr>
</table>

<h2>Try It Yourself</h2>
<p>Ready to remove backgrounds the easy way? Try our <a href="/en/tools/background-remover">AI background remover tool</a> — your first 5 credits are free when you sign up. No software download, no learning curve, just instant results.</p>`,
  },
  {
    slug: "best-ai-tools-content-creators-2026",
    title: "10 Best AI Tools for Content Creators in 2026 — Free & Paid Options",
    description: "Discover the best AI tools for content creators in 2026. Compare free and paid options for writing, image generation, text-to-speech, and more. Boost your content workflow with AI.",
    date: "2026-05-18",
    category: "Content Creation",
    tags: ["AI content tools", "content creator tools", "AI writing tools", "AI image generator", "text to speech"],
    relatedTools: ["article-generator", "text-polish", "text-to-speech", "ai-image-generator"],
    content: `<p>Content creators in 2026 have access to an unprecedented range of AI tools that can write, design, and produce content faster than ever. But with hundreds of options available, which ones are actually worth using? Here is our curated list of the 10 best AI tools for content creators, organized by use case.</p>

<h2>AI Writing & Content Tools</h2>
<h3>1. AI Article Generator — Best for Long-Form Content</h3>
<p>Need blog posts, articles, or website copy? An <a href="/en/tools/article-generator">AI article generator</a> creates complete, well-structured articles from just a topic and keywords. Choose your tone (professional, casual, persuasive) and word count (50-5000 words) for full control.</p>
<p><strong>Why we recommend it:</strong> Uses Llama 3 70B for high-quality output. Supports custom word counts and 5 writing tones.</p>

<h3>2. AI Text Polish — Best for Editing & Refinement</h3>
<p>Got a rough draft? An <a href="/en/tools/text-polish">AI text polisher</a> can rewrite, shorten, expand, or fix grammar in seconds. Six modes cover everything from academic papers to casual social media posts.</p>
<p><strong>Key feature:</strong> Auto-detects English, Spanish, and Arabic text — no need to specify language.</p>

<h2>AI Audio & Speech Tools</h2>
<h3>3. AI Text to Speech — Best for Voiceovers</h3>
<p>Convert any text to natural-sounding speech in 17 languages. Perfect for creating podcast intros, video voiceovers, e-learning content, and audio versions of blog posts. Our <a href="/en/tools/text-to-speech">text to speech tool</a> converts up to 2000 characters per use without any file uploads.</p>

<h2>AI Image Generation & Editing Tools</h2>
<h3>4. AI Image Generator — Best for Original Visuals</h3>
<p>Create unique images from text descriptions using SDXL. Great for featured images, social media graphics, and concept art. <a href="/en/tools/ai-image-generator">Generate AI images</a> in multiple aspect ratios and quality levels.</p>

<h3>5. Background Remover — Best for Product Photos</h3>
<p>Remove backgrounds instantly for product listings, profile pictures, and marketing materials.</p>

<h2>Starting Your AI Content Toolkit</h2>
<p>The best part? Most of these tools offer free credits to start. Sign up and get 5 free credits to try any combination of tools. As your content needs grow, affordable credit packages and monthly subscriptions unlock unlimited usage.</p>`,
  },
  {
    slug: "restore-old-photos-ai-guide",
    title: "How to Restore Old Photos with AI — Complete Guide 2026",
    description: "Step-by-step guide to restoring old damaged photos using AI. Learn how to fix scratches, fading, and low resolution, then add color to black and white images for stunning results.",
    date: "2026-05-17",
    category: "Photo Restoration",
    tags: ["restore old photos", "photo restoration", "AI photo repair", "colorize photos", "fix old photos"],
    relatedTools: ["photo-restorer", "colorizer", "image-upscaler"],
    content: `<p>Old photographs are irreplaceable windows into the past, but time takes its toll — scratches appear, colors fade, and details blur. AI photo restoration has made it possible for anyone to restore vintage family photos to near-original quality without expensive professional services. Here is the complete restoration workflow.</p>

<h2>Step 1: Assess the Damage</h2>
<p>Before restoration, evaluate what needs fixing: physical damage (scratches, tears, dust spots), color fading or yellowing, low resolution from old cameras, missing or damaged facial details, and whether the photo is black and white or color.</p>

<h2>Step 2: Repair Physical Damage</h2>
<p>Start with an <a href="/en/tools/photo-restorer">AI photo restorer</a> to fix scratches, dust, and fading. Our tool uses Topaz Labs' industry-leading Dust & Scratch v2 model for automatic restoration. Upload your photo and choose Auto mode for general repair. For photos where faces need special attention, switch to Face Pro mode, which uses GFPGAN to enhance facial details with remarkable accuracy.</p>
<p><strong>Pro tip:</strong> For severely damaged photos, run the restoration twice. The AI learns from each pass and improves results.</p>

<h2>Step 3: Colorize Black and White Photos</h2>
<p>Once the damage is fixed, bring those black and white memories to life with an <a href="/en/tools/colorizer">AI colorizer</a>. Our tool uses FLUX Kontext Pro — a state-of-the-art AI that understands image context to assign realistic colors. It recognizes objects, materials, and scenes: blue skies, green grass, natural skin tones, and period-appropriate clothing colors.</p>
<p>Choose from four color styles: Natural for everyday photos, Vibrant for landscapes, Portrait for people photos, and Classic for a vintage film look.</p>

<h2>Step 4: Upscale to HD Resolution</h2>
<p>Old photos are often low resolution by today's standards. After restoration and colorization, use an <a href="/en/tools/image-upscaler">image upscaler</a> to boost resolution up to 4x. This makes restored photos suitable for printing, framing, or digital photo frames. Choose Photo mode for vintage prints and Anime mode for hand-drawn or illustrated images.</p>

<h2>The Complete Pipeline</h2>
<p>The full restoration workflow — repair, colorize, upscale — takes about 5-10 minutes per photo and costs just 9 credits total. Compare that to professional photo restoration services which charge $50-200 per photo and take weeks. Ready to start? <a href="/en/signup">Create a free account</a> and get 5 credits to try your first restoration.</p>`,
  },
  {
    slug: 'ai-image-generator-prompt-guide',
    title: 'How to Write Better AI Image Prompts — Stop Getting Weird Results',
    description: 'Getting six-fingered hands and melting faces from your AI image generator? The problem is your prompt. Here is how to write prompts that actually work.',
    date: '2026-05-16',
    category: 'Image Generation',
    tags: ['AI image prompts', 'text to image prompts', 'SDXL prompt guide', 'AI image generator tips', 'prompt engineering'],
    relatedTools: ['ai-image-generator', 'style-transfer'],
    content: '<p>You type "a cat" into an AI image generator and get a blurry feline blob. Someone else types a paragraph and gets a magazine-cover-quality image. The difference is the prompt.</p><p>AI image generators are not mind readers. A good prompt tells the model exactly what to create: subject, style, lighting, composition, and details. Our <a href="/en/tools/ai-image-generator">AI image generator</a> uses SDXL, which responds well to detailed prompts.</p><h2>The four parts of a good prompt</h2><p><strong>Subject:</strong> What is in the image? Be specific. Instead of "a dog," try "a golden retriever puppy sitting on a wooden dock."</p><p><strong>Style:</strong> What should it look like? Add keywords like "photorealistic," "oil painting," "3D render," "cinematic lighting," or "watercolor sketch."</p><p><strong>Composition:</strong> How is the scene arranged? Try "close-up portrait," "wide landscape shot," "top-down view," or "subject centered with blurred background."</p><p><strong>Details:</strong> Colors, textures, mood, time of day. "Warm sunset light, misty atmosphere, detailed fur texture" adds specificity.</p><h2>Common mistakes</h2><p>Do not use negatives at first. Instead of saying what you do not want, describe what you do want. Too many conflicting styles confuse the model. Pick one direction.</p><p>Ready to try? <a href="/en/tools/ai-image-generator">Generate AI images</a> with your new prompting skills.</p>',
  },
  {
    slug: 'remove-watermark-from-photo',
    title: 'How to Remove a Watermark from a Photo — The Right Way',
    description: 'Got a photo with a watermark or timestamp on it? Here is how to remove it cleanly without cropping or blurring the whole image.',
    date: '2026-05-15',
    category: 'Image Editing',
    tags: ['remove watermark', 'watermark remover', 'erase logo from photo', 'remove timestamp', 'AI inpainting'],
    relatedTools: ['watermark-remover', 'object-remover', 'background-remover'],
    content: '<p>Cropping is the lazy way to remove a watermark, but it often ruins the composition. Blurring leaves an obvious smudge. <a href="/en/tools/watermark-remover">AI watermark removal</a> fills the removed area with content that matches the surrounding image.</p><h2>How AI watermark removal works</h2><p>Our <a href="/en/tools/watermark-remover">watermark remover</a> uses BRIA Eraser, an AI inpainting model. It analyzes the area around the watermark and generates new pixels that match the texture, color, and pattern of the surrounding image.</p><p>For semi-transparent watermarks, the AI works in one click. For solid logos or text overlays, use the canvas mask tool to paint over the area.</p><h2>What it can and cannot remove</h2><p>It handles: semi-transparent watermarks, timestamp overlays, small logo stamps, text captions. It struggles with: watermarks covering more than 30% of the image, complex patterns behind the watermark, very low-resolution images.</p><p>For removing larger objects, use the <a href="/en/tools/object-remover">object remover</a> instead.</p>',
  },
  {
    slug: 'text-to-speech-for-content-creators',
    title: 'Converting Articles to Audio: A Content Creator\'s Workflow',
    description: 'Turn your blog posts into audio versions in minutes. Here is a practical text-to-speech workflow that sounds natural, not robotic.',
    date: '2026-05-14',
    category: 'Content Creation',
    tags: ['text to speech', 'convert article to audio', 'AI voiceover', 'TTS for bloggers', 'audio content'],
    relatedTools: ['text-to-speech', 'text-polish', 'article-generator'],
    content: '<p>Adding audio versions of your articles is one of the easiest ways to increase engagement. Some readers prefer listening while commuting or doing chores. And podcast directories are less crowded than Google search results.</p><p>But hiring voice actors for every article is impractical. <a href="/en/tools/text-to-speech">AI text to speech</a> has gotten good enough that most listeners cannot tell the difference.</p><h2>The workflow that sounds natural</h2><p>First, <a href="/en/tools/text-polish">polish your text</a> for spoken delivery. Written sentences often use more complex structures than spoken ones. Run your article through the Polish tool in Casual mode — it shortens sentences and uses more natural phrasing.</p><p>Second, split your content into segments of 500-1000 characters. Shorter segments give you more control. You can redo individual sections without regenerating the whole thing.</p><h2>Languages and voice quality</h2><p>The <a href="/en/tools/text-to-speech">free text to speech tool</a> supports 17 languages. The voice sounds natural for English, Spanish, French, and most European languages. For tonal languages, the intonation is correct but not perfect.</p>',
  },
  {
    slug: 'colorize-black-and-white-photos',
    title: 'Colorizing Old Family Photos: Before and After Examples',
    description: 'See what happens when you run black and white photos through an AI colorizer. The results are better than you would expect.',
    date: '2026-05-13',
    category: 'Photo Restoration',
    tags: ['colorize photos', 'black and white to color', 'AI colorizer', 'old photo restoration', 'vintage photo colorization'],
    relatedTools: ['colorizer', 'photo-restorer', 'image-upscaler'],
    content: '<p>My grandmother\'s wedding photo sat in a drawer for 60 years. I ran it through an AI colorizer last week and saw the blue of her dress and the flowers in her bouquet for the first time.</p><p>Here is how to get the best results from an <a href="/en/tools/colorizer">AI photo colorizer</a>.</p><h2>Restore first, colorize second</h2><p>Before adding color, fix the damage. Use the <a href="/en/tools/photo-restorer">photo restorer</a> to clean up scratches, dust, and fading. Colorizing a damaged photo amplifies the flaws.</p><p>After restoration, choose the right color style. Natural works for everyday photos. Vibrant for landscapes. Portrait for skin tones. Classic for a vintage-film look.</p><p>Adding a text description helps: "blue dress, red flowers, wooden furniture, cream walls." The AI uses this to pick more accurate colors.</p><h2>When black and white is better</h2><p>High-contrast black and white portraits often lose their impact when colorized. If the original is already powerful in black and white, leave it alone.</p><p>Ready to try? <a href="/en/signup">Sign up free</a> and get credits to colorize your photos. The <a href="/en/tools/colorizer">B&W colorizer</a> costs 2 credits per use.</p>',
  },
  {
    slug: 'ai-article-writing-vs-human',
    title: 'AI Article Generator: What It Does Well and Where It Falls Short',
    description: 'I tested an AI article generator on five different topics. Here is what worked, what did not, and how to use it as a drafting tool.',
    date: '2026-05-12',
    category: 'Content Creation',
    tags: ['AI article generator', 'AI writer review', 'AI content creation', 'Llama article writing', 'AI blogging tool'],
    relatedTools: ['article-generator', 'text-polish', 'text-to-speech'],
    content: '<p>I fed our <a href="/en/tools/article-generator">AI article generator</a> five topics: a how-to guide, a product comparison, a news summary, a personal essay, and a technical tutorial. Here is the honest breakdown.</p><h2>What it does well</h2><p><strong>Structure.</strong> For informational articles, the AI nails the outline. Headings, subheadings, logical flow — it produces a skeleton that would take a human 20 minutes to plan. The 5-tone selector actually changes the output noticeably.</p><p><strong>Research-heavy topics.</strong> If the topic is well-documented online, the AI synthesizes it well. The word count control (50 to 5000 words) gives useful flexibility.</p><h2>Where it falls short</h2><p><strong>Original opinions.</strong> The AI cannot have a genuine hot take because it has no experiences. It will give you balanced, reasonable takes that sound like committee-written statements.</p><p><strong>Specific details.</strong> It confidently states facts that are wrong. Always verify claims and numbers.</p><p><strong>Humor and personality.</strong> The output is technically correct but flat. Running it through the <a href="/en/tools/text-polish">text polisher</a> in Casual mode helps, but it still needs human editing.</p><h2>The practical workflow</h2><p>Use the AI to generate a first draft. Rewrite the intro in your own voice. Add personal examples and specific data. Run a final polish pass for grammar. This gives you 80% of the output for 20% of the effort.</p>',
  },
  {
    slug: 'upscale-images-without-losing-quality',
    title: 'How to Upscale an Image Without Making It Look Terrible',
    description: 'Enlarging a small image usually makes it pixelated and blurry. AI upscaling fixes that. Here is how it works and when to use it.',
    date: '2026-05-11',
    category: 'Image Editing',
    tags: ['upscale image', 'AI upscaler', 'increase image resolution', 'enlarge photo', 'Real-ESRGAN'],
    relatedTools: ['image-upscaler', 'ai-image-generator', 'photo-restorer'],
    content: '<p>You have a 400-pixel-wide product photo and the printer needs it at 1600 pixels. Stretching it in Photoshop gives you a pixelated mess. <a href="/en/tools/image-upscaler">AI image upscaling</a> fills in the missing detail intelligently.</p><h2>How AI upscaling is different</h2><p>Regular resizing averages neighboring pixels. AI upscaling uses Real-ESRGAN, trained to reconstruct high-res images from low-res inputs. It adds plausible detail — hair texture, fabric weave, text sharpness — that simple resizing loses.</p><p>Our <a href="/en/tools/image-upscaler">image upscaler</a> has two modes. Photo mode for photographs. Anime mode for illustrations and line art. Using the wrong mode produces worse results.</p><h2>Practical limits</h2><p>2x upscaling almost always looks good. 4x is where quality depends on the source. A sharp, well-lit photo upscales beautifully. A grainy phone photo at 4x will show the AI\'s guesswork.</p><p>For best results: start with the highest quality source, choose the right mode, and upscale in stages rather than jumping straight to 4x.</p>',
  },
  {
    slug: 'blur-faces-in-photos-privacy',
    title: 'Blurring Faces in Photos for Privacy: A Quick Guide',
    description: 'Need to share a photo publicly but protect people\'s identities? Face blurring tools make it easy — pick mosaic, gaussian, or fun emoji overlays.',
    date: '2026-05-10',
    category: 'Image Editing',
    tags: ['blur faces', 'face privacy', 'pixelate faces', 'emoji face cover', 'photo privacy tool'],
    relatedTools: ['face-blur', 'background-remover', 'image-description'],
    content: '<p>You took a great photo at a school event and want to share it. But there are other people\'s kids in the shot. Or you are a journalist who needs to protect identities. Or selling something online and do not want your reflection visible.</p><p>A <a href="/en/tools/face-blur">face blur tool</a> handles this in seconds. Upload, the AI detects faces, and you pick how to cover them.</p><h2>How it works</h2><p>Our tool uses Grounding DINO to find faces at various angles and lighting conditions. Detection takes about 10 seconds on a cold start.</p><p>Four overlay options: Mosaic (pixelated grid, most common), Gaussian (smooth blur), Pixelate (larger blocks), and emoji (cute Twemoji icons for informal photos).</p><p>If the AI misses a face, add manual blur regions with the brush tool. If it detects something that is not a face, remove that region.</p><h2>Beyond face blurring</h2><p>Tattoos, name tags, license plates, and distinctive clothing can also identify people. For serious privacy needs, combine face blurring with manual review. And remove EXIF data — many phones embed GPS coordinates in photos by default.</p>',
  },
];

// Synchronous static accessors — used at build time (generateStaticParams)
export function getBlogPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

// Async fetch from API — used at runtime for fresh content, with ISR
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_BASE}/api/blog`, { next: { revalidate: 300 } });
    if (res.ok) {
      const data = await res.json();
      if (data.posts?.length) return data.posts.map(apiToBlogPost);
    }
  } catch { /* fall through to static */ }
  return getBlogPosts();
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | undefined> {
  try {
    const res = await fetch(`${API_BASE}/api/blog/${slug}`, { next: { revalidate: 300 } });
    if (res.ok) {
      const data = await res.json();
      if (data.slug) return apiToBlogPost(data);
    }
  } catch { /* fall through to static */ }
  return getBlogPost(slug);
}