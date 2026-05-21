"""Update howToUse and FAQ for all AI ToolBox tools."""
import re, json

PATH = "C:/Users/jun/ai-toolbox/src/lib/tools.ts"
with open(PATH, encoding="utf-8") as f:
    content = f.read()

# ── Complete updates for all tools ──
UPDATES = {
    "ai-image-generator": {
        "howToUse": [
            "Write a detailed prompt describing the image you want — include subject, style, lighting, and composition for best results.",
            "Choose quality level (Low/Medium/High), aspect ratio (1:1, 3:2, 2:3), and output format (PNG, JPEG, WebP).",
            "Optionally upload a reference image to guide the AI style. Your reference image affects composition and color palette.",
            "Set the number of images (1-4) — each additional image adds 1 credit to the base cost.",
            "Click Generate and download your images in your chosen format.",
        ],
        "faq": [
            {"question": "How does AI image generation work?", "answer": "Our tool uses Stability AI SDXL — a state-of-the-art text-to-image model. It interprets your text prompt and generates photorealistic or artistic images. Reference images are supported via img2img mode for style guidance."},
            {"question": "What quality should I choose?", "answer": "Low (1 credit) is fastest and cheapest — good for quick drafts. Medium (2 credits) balances speed and quality. High (3 credits) uses more inference steps for maximum detail, ideal for final outputs."},
            {"question": "How do I write a good prompt?", "answer": "Be specific and descriptive. Include subject, action, setting, colors, style, and mood. Instead of 'a cat', try 'a fluffy orange tabby cat sitting on a sunny windowsill, soft morning light, photorealistic, 4K detail'. Adding a reference image further refines the result."},
            {"question": "How many images can I generate at once?", "answer": "1 to 4 images per generation. Each additional image adds 1 credit. Generating multiple images at once is more credit-efficient than running separate generations."},
            {"question": "What are the credits and image formats?", "answer": "Base cost is 1 credit. Quality: Low=1, Medium=2, High=3 credits. Reference image adds 1. PNG (lossless, larger file), JPEG (compressed, smaller), or WebP (modern web format) for output."},
        ]
    },
    "avatar-generator": {
        "howToUse": [
            "Upload a clear, front-facing photo with even lighting — avoid shadows, hats, or obstructed faces.",
            "Select one of 6 avatar styles: 3D Cartoon, Anime, Professional, Pixel Art, Watercolor, or Sketch.",
            "Click Generate and the AI creates 4 avatar variations using per-style optimized SDXL prompts.",
            "Download all 4 avatar variations in high resolution for social media, gaming, or professional profiles.",
        ],
        "faq": [
            {"question": "What photo works best for avatar generation?", "answer": "A clear, front-facing portrait with good lighting and a neutral background works best. Avoid group photos, sunglasses, hats, or extreme angles. The AI needs a clear view of your facial features to generate accurate avatars."},
            {"question": "What styles are available and which should I choose?", "answer": "6 styles: 3D Cartoon (Pixar-like, social media), Anime (Japanese animation), Professional (corporate headshot), Pixel Art (retro gaming), Watercolor (artistic painted look), and Sketch (pencil drawing). Each uses a dedicated SDXL prompt tuned for that aesthetic."},
            {"question": "How many avatar variations do I get?", "answer": "4 variations per generation. The AI creates 4 different outputs from the same photo and style so you can pick your favorite. All 4 are included in the 5-credit cost."},
            {"question": "How many credits does it cost?", "answer": "5 credits per generation (includes all 4 variations). This is higher than some tools because avatar generation runs multiple SDXL inferences with optimized per-style prompts for consistent quality."},
        ]
    },
    "background-remover": {
        "howToUse": [
            "Upload an image — product photos, portraits, and objects with clear edges work best.",
            "Choose Auto mode for one-click AI background removal, or Manual mode to paint green strokes on areas you want to keep.",
            "Pick a replacement background color: transparent, white, black, or any custom hex color.",
            "Download your image with a clean, transparent or solid-color background in PNG format.",
        ],
        "faq": [
            {"question": "How accurate is the AI background removal?", "answer": "Powered by BRIA RMBG — a state-of-the-art background removal model. It handles complex edges like hair, fur, and transparent objects well. For tricky edges, use Manual mode to paint keep areas with green strokes for precise control."},
            {"question": "When should I use Manual mode instead of Auto?", "answer": "Use Manual mode when the subject has fine details (wispy hair, lace, fur) or when Auto mode removes parts of the subject you want to keep. Paint green strokes over keep areas and the AI preserves them precisely."},
            {"question": "What replacement backgrounds can I choose?", "answer": "Transparent (PNG with alpha channel), solid white, solid black, or any custom hex color. Great for e-commerce product shots, profile pictures, and graphic design projects."},
            {"question": "What image formats and sizes are supported?", "answer": "PNG, JPG, and WebP up to 10MB. Output is always lossless PNG to preserve transparency and maximum quality."},
        ]
    },
    "watermark-remover": {
        "howToUse": [
            "Upload an image with watermarks, logos, timestamp stamps, or unwanted text overlays.",
            "Use Auto Detect for the AI to find and remove watermarks automatically, or paint a red mask for manual precision.",
            "For manual mode, paint over the watermark area with the brush tool — rough strokes work best.",
            "Click Remove and download your cleaned image — the AI fills removed areas naturally.",
        ],
        "faq": [
            {"question": "Can it remove any watermark?", "answer": "The AI works best on semi-transparent watermarks, logos, and text overlays. Large opaque watermarks may require manual masking. The tool uses BRIA Eraser inpainting which fills removed areas with context-aware content."},
            {"question": "What's the difference between Auto Detect and Manual masking?", "answer": "Auto Detect uses Florence-2 vision AI to find watermarks automatically — best for typical corner/center watermarks. Manual mode gives you full control with a paintbrush for irregular watermarks or when Auto doesn't find them."},
            {"question": "How should I paint the mask for best results?", "answer": "Rough strokes over the watermark area work best. Don't worry about pixel-perfect edges — the AI uses surrounding context to fill naturally. Cover the entire watermark plus a small margin around it."},
            {"question": "How many credits does watermark removal cost?", "answer": "3 credits per image. This covers both the detection step (Florence-2 vision model) and the removal step (BRIA Eraser inpainting)."},
        ]
    },
    "photo-restorer": {
        "howToUse": [
            "Upload an old, damaged, or faded photo — moderate scratches, dust, and fading restore best.",
            "Choose Auto mode for general scratch/dust removal, or Face Pro mode (GFPGAN) for face enhancement.",
            "Click Restore and the AI processes your photo — restoration takes 10-30 seconds.",
            "Download your restored photo and compare with the original.",
        ],
        "faq": [
            {"question": "What's the difference between Auto and Face Pro mode?", "answer": "Auto mode uses Topaz Dust & Scratch v2 for general restoration — removes scratches, dust, and fading. Face Pro adds GFPGAN face enhancement on top, restoring facial details in portraits and group photos."},
            {"question": "Can it restore severely damaged photos?", "answer": "The AI handles moderate damage like scratches, dust, and fading well. Severely torn, heavily water-damaged, or extremely low-resolution photos may show limited improvement. For best results, start with the highest quality scan possible."},
            {"question": "How is this different from B&W Colorizer?", "answer": "Photo Restorer repairs physical damage — scratches, dust, fading — and enhances faces. The Colorizer adds realistic color to black and white photos without changing the original image structure. Use both together: restore first, then colorize."},
            {"question": "What image formats are supported?", "answer": "PNG, JPG, and WebP up to 10MB. Output is PNG for lossless quality preservation."},
        ]
    },
    "image-upscaler": {
        "howToUse": [
            "Upload an image you want to enlarge — older photos, AI-generated images, and low-res pictures all benefit.",
            "Choose Photo mode (real-world photos) or Anime mode (illustrations, manga, digital art) for optimized results.",
            "Select 2x or 4x upscaling factor — 4x quadruples both width and height.",
            "Download your high-resolution image with enhanced detail and clarity.",
        ],
        "faq": [
            {"question": "How much can I upscale an image?", "answer": "2x or 4x the original resolution. For example, a 500x500 image becomes 1000x1000 (2x) or 2000x2000 (4x). Real-ESRGAN AI reconstructs high-frequency details, not just pixel stretching."},
            {"question": "What's the difference between Photo and Anime mode?", "answer": "Photo mode is optimized for real-world photographs with natural textures. Anime mode is tuned for illustrations, manga, and digital art with clean lines and flat colors. Using the right mode prevents artifacts."},
            {"question": "When should I use 4x instead of 2x?", "answer": "Use 2x for moderate enlargement — good for most images. Use 4x for significant enlargement (printing, 4K display). 4x takes slightly longer but the AI fills in missing detail intelligently."},
            {"question": "Is the upscaling free?", "answer": "No — 2 credits per image regardless of scale factor. The AI model (Real-ESRGAN) runs on GPU infrastructure, but we keep the cost low to make it accessible."},
        ]
    },
    "style-transfer": {
        "howToUse": [
            "Upload a photo you want to transform — portraits, landscapes, and architectural photos work well.",
            "Select one of 6 artistic styles: Oil Painting, Watercolor, Sketch, Cartoon, Cyberpunk, or Fantasy.",
            "Optionally add a text description to fine-tune the style application (e.g., \"warm sunset colors\").",
            "Click Generate and wait 10-20 seconds. Download your stylized artwork.",
        ],
        "faq": [
            {"question": "What styles are available and what do they look like?", "answer": "6 styles: Oil Painting (rich brushstrokes, classical art feel), Watercolor (soft washes, artistic), Sketch (pencil/charcoal drawing), Cartoon (animated style), Cyberpunk (neon-lit futuristic), and Fantasy (ethereal, magical). Each uses IP-Adapter + ControlNet for consistent results."},
            {"question": "How is this different from the AI Image Generator?", "answer": "Style Transfer transforms an existing photo by applying an artistic style while preserving the original composition and subject. AI Image Generator creates entirely new images from text prompts. Use Style Transfer when you want to restyle a specific photo."},
            {"question": "What photos work best for style transfer?", "answer": "Photos with clear subjects and good contrast produce the best results. Portraits, landscapes, and architectural shots with distinct shapes transfer well. Avoid very dark or low-contrast images — the AI needs visible structure to work with."},
            {"question": "Can I use a custom style or reference image?", "answer": "Currently 6 preset styles are available, each optimized for consistent results. The optional text prompt lets you fine-tune colors, mood, and details within the chosen style."},
        ]
    },
    "text-to-speech": {
        "howToUse": [
            "Type or paste up to 2000 characters of text you want to convert to speech.",
            "Select a language for proper pronunciation and natural voice output.",
            "Click Generate and the AI synthesizes the audio — typically 10-15 seconds.",
            "Play the audio preview directly in your browser, then download the MP3 file.",
        ],
        "faq": [
            {"question": "What languages are supported for text-to-speech?", "answer": "17 languages: English, Spanish, Arabic, French, German, Italian, Japanese, Chinese, Korean, Portuguese, Russian, Turkish, Polish, Dutch, Czech, Hindi, and Hungarian. Powered by MiniMax speech-2.6-turbo for natural-sounding output."},
            {"question": "How long can the text be?", "answer": "Up to 2000 characters per generation. For longer texts like articles or scripts, break them into segments of 2000 characters or less and process each separately."},
            {"question": "What audio format does it produce?", "answer": "MP3 format — universally compatible with all media players, smartphones, podcast platforms, and video editing software. No special codecs needed."},
            {"question": "How natural does the AI voice sound?", "answer": "MiniMax speech-2.6-turbo produces highly natural speech with proper intonation, pacing, and emotion. It's significantly better than older TTS systems — most listeners can't tell it's AI-generated."},
            {"question": "Can I choose different voices?", "answer": "Voice selection is currently limited. The tool uses optimized default voices per language for consistent quality. Multi-voice support is on the roadmap for future updates."},
        ]
    },
    "image-description": {
        "howToUse": [
            "Upload an image you want described — photos, artwork, screenshots, and product images all work.",
            "Optionally type a custom question (e.g., \"What breed is the dog?\" or \"Describe the lighting\") for targeted analysis.",
            "Click Generate and the AI vision model analyzes your image in 15-30 seconds.",
            "Get an SEO-optimized ALT text and a detailed description covering objects, colors, composition, and mood.",
        ],
        "faq": [
            {"question": "What does the AI analyze in my image?", "answer": "Powered by NVIDIA Nemotron Nano v2 12B VL — it identifies objects, people, colors, composition, setting, mood, lighting, text content, and spatial relationships. The detailed description covers everything a human would notice."},
            {"question": "Can I ask specific questions about my image?", "answer": "Yes. Use the optional prompt field for custom questions like 'What breed is the dog?', 'What brand is the car?', or 'Describe the architectural style'. The AI answers your specific question in addition to generating the standard description."},
            {"question": "Is this tool useful for SEO and accessibility?", "answer": "Absolutely. The ALT text output is specifically designed for image SEO (search engines) and web accessibility (screen readers). The detailed description gives you rich content for captions, product listings, and social media posts."},
            {"question": "What image formats and sizes are supported?", "answer": "PNG, JPG, and WebP up to 10MB. The AI processes images at their original resolution — no quality loss from resizing."},
        ]
    },
    "article-generator": {
        "howToUse": [
            "Enter a specific topic — be detailed for better results. Instead of 'marketing', try 'how AI is transforming small business marketing in 2026'.",
            "Optionally add keywords to guide the content focus and select a tone (Neutral, Professional, Casual, etc.).",
            "Set your desired word count (50-5000 words) using the slider or manual input.",
            "Click Generate and the AI writes a structured article with title, introduction, 3-5 main sections, and conclusion.",
            "Review the article, copy to clipboard, or download as a text file for further editing.",
        ],
        "faq": [
            {"question": "How do I get the best article results?", "answer": "Be specific with your topic. Include keywords relevant to your niche. Choose the right tone for your audience — Professional for business, Casual for blog readers, Academic for research. The AI adapts structure and vocabulary based on your inputs."},
            {"question": "How long are the generated articles?", "answer": "You control the length — set 50 to 5000 words. The AI generates articles with proper structure at any length: title, compelling introduction, 3-5 main sections with subheadings, and a conclusion with key takeaways."},
            {"question": "Can I use the generated articles commercially?", "answer": "Yes. All content you generate belongs to you. Use it on your blog, website, newsletter, social media, or anywhere you need original content. There are no usage restrictions or attribution requirements."},
            {"question": "How is this different from Text Polish?", "answer": "Article Generator creates complete, structured articles from a topic and keywords — it's for original content creation. Text Polish refines existing text — fixing grammar, rewriting, shortening, or expanding. Use Article Generator to create drafts, then Text Polish to polish the language."},
            {"question": "What AI model powers this tool?", "answer": "Meta Llama 3 70B — one of the most capable open-source language models. It produces coherent, well-structured long-form content with natural human-like writing. The model supports English, Spanish, and Arabic natively."},
        ]
    },
    "face-blur": {
        "howToUse": [
            "Upload a photo containing faces you want to obscure — group photos, event shots, or street photography.",
            "The AI (Grounding DINO) automatically detects all faces in the image within seconds.",
            "Choose a blur style: Mosaic (pixelated blocks), Gaussian (smooth blur), Pixelate (color blocks), or Emoji (cute overlays).",
            "Toggle Preview to compare before/after. Add manual blur regions by clicking and dragging for extra coverage.",
            "Click Download to save the processed image as lossless PNG.",
        ],
        "faq": [
            {"question": "How does face detection work?", "answer": "We use Grounding DINO — a state-of-the-art zero-shot object detection model. It detects faces with high accuracy even in group photos, side profiles, and partially obscured faces. The AI runs on GPU for fast processing."},
            {"question": "Can I manually add blur regions?", "answer": "Yes. Use the manual selection tool to draw rectangles over any area you want to obscure — faces the AI missed, license plates, logos, or any sensitive content. You can also remove individual regions with Undo or Clear All."},
            {"question": "What blur styles are available?", "answer": "Four styles: Mosaic (classic pixelated blocks), Gaussian (smooth lens blur), Pixelate (cell-based color averaging), and Emoji (cute Twemoji face overlays). Each provides different levels of privacy protection and visual appeal."},
            {"question": "How many credits does it cost?", "answer": "Standard images (up to 3000px, under 5 faces): 2 credits. High-resolution (>3000px) or 5+ faces: 4 credits. The cost covers both face detection and blur processing."},
            {"question": "Is this suitable for journalism and privacy compliance?", "answer": "Yes. Journalists and content creators use this tool to protect identities in photos before publishing. The blur is irreversible — processed faces cannot be unblurred — making it suitable for privacy-sensitive contexts."},
        ]
    },
    "colorizer": {
        "howToUse": [
            "Upload a black and white photo — old family portraits, historical images, or artistic B&W shots.",
            "Optionally select a color style (Natural, Vibrant, Portrait, Classic) and add a description like 'blue sky, green grass'.",
            "Click Generate and the AI colorizes your photo in 10-20 seconds using FLUX Kontext Pro.",
            "Toggle between Before/After to see the transformation, then download your colorized photo.",
        ],
        "faq": [
            {"question": "What types of photos colorize best?", "answer": "Clear, well-lit black and white photos produce the most accurate results. Portraits, landscapes, and historical photos all colorize well. The AI uses context — skin tones, sky, vegetation — to assign realistic colors."},
            {"question": "How is this different from Photo Restorer?", "answer": "Photo Restorer repairs physical damage like scratches, dust, and fading using Topaz AI. Colorizer adds realistic color to B&W photos using FLUX Kontext Pro. Best workflow: restore first to fix damage, then colorize to add life."},
            {"question": "How do I get the best colorization results?", "answer": "Choose a style that matches your photo (Natural for everyday, Vibrant for landscapes, Portrait for faces, Classic for vintage). Add an optional text description to guide specific colors — 'navy blue jacket, golden sunset, green trees'."},
            {"question": "Can it colorize any black and white image?", "answer": "Yes — vintage family photos, historical images, artistic B&W photography, and even screenshots. The AI understands context (grass should be green, sky should be blue) but you can override with text descriptions for creative effects."},
        ]
    },
    "object-remover": {
        "howToUse": [
            "Upload a photo with unwanted objects, people, text, logos, or blemishes.",
            "Paint a red mask over the areas you want removed — rough strokes work, don't need pixel precision.",
            "Click Remove and the AI (BRIA Eraser inpainting) fills the masked area with context-aware content.",
            "Review the result and download your cleaned-up photo. Re-mask and re-process if needed.",
        ],
        "faq": [
            {"question": "What can I remove from my photos?", "answer": "People, objects, text, logos, blemishes, power lines, date stamps — anything you paint over. The AI fills the area with content that matches the surrounding image using BRIA Eraser inpainting technology."},
            {"question": "How is this different from Watermark Remover?", "answer": "Watermark Remover auto-detects watermarks and logos using Florence-2 vision AI — best for text/logos. Object Remover lets you manually paint what to remove — ideal for larger objects, people, and irregular areas. Both use BRIA Eraser for the actual inpainting."},
            {"question": "How should I paint the mask for best results?", "answer": "Rough red strokes covering the object work best. Include a small margin around the object. The AI needs some surrounding context to fill naturally. Avoid hairline-precise masking — it's counterproductive."},
            {"question": "What if the first result isn't perfect?", "answer": "You can re-process unlimited times within the same session. If the AI fill looks unnatural, try masking a slightly larger area, or break a large object into smaller sections and remove them one at a time."},
        ]
    },
}

# ── Apply updates ──
for tool_id, sections in UPDATES.items():
    # Find the tool block start
    tool_pattern = rf'id:\s*"{tool_id}"'
    tool_match = re.search(tool_pattern, content)
    if not tool_match:
        print(f"  NOT FOUND: {tool_id}")
        continue

    # Extract the tool block (from this tool's 'id' to the next tool's 'id')
    tool_start = tool_match.start()
    # Find the NEXT tool after this one
    next_tool = re.search(r'\n\s*\{\s*\n\s*id:', content[tool_start + 10:])
    if next_tool:
        block_end = tool_start + 10 + next_tool.start()
    else:
        block_end = len(content)
    tool_block = content[tool_start:block_end]

    modified_block = tool_block

    for section_name in ["howToUse", "faq"]:
        if section_name not in sections:
            continue
        items = sections[section_name]

        # Find section in tool block
        section_pattern = rf'{section_name}:\s*\['
        sec_match = re.search(section_pattern, modified_block)
        if not sec_match:
            print(f"  No {section_name} found in {tool_id}")
            continue

        # Find the matching closing bracket
        sec_start = sec_match.end() - 1  # position of '['
        depth = 0
        sec_end = sec_start
        for i in range(sec_start, len(modified_block)):
            if modified_block[i] == '[':
                depth += 1
            elif modified_block[i] == ']':
                depth -= 1
                if depth == 0:
                    sec_end = i + 1
                    break

        # Build replacement
        if section_name == "howToUse":
            lines = [f"{section_name}: ["]
            for item in items:
                escaped = item.replace('\\', '\\\\').replace('"', '\\"')
                lines.append(f'      "{escaped}",')
            lines.append("    ]")
        else:
            lines = [f"{section_name}: ["]
            for item in items:
                q_escaped = item["question"].replace('\\', '\\\\').replace('"', '\\"')
                a_escaped = item["answer"].replace('\\', '\\\\').replace('"', '\\"')
                lines.append(f'      {{ question: "{q_escaped}", answer: "{a_escaped}" }},')
            lines.append("    ]")

        replacement = "\n".join(lines)
        modified_block = modified_block[:sec_start] + replacement[replacement.index('['):] + modified_block[sec_end:]

    content = content[:tool_start] + modified_block + content[block_end:]
    print(f"  OK: {tool_id}")

with open(PATH, "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
