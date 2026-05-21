export type ToolCategory = "image-generation" | "image-editing" | "content-creation" | "document";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  creditCost: number;
  free?: boolean;
  badge?: string;
  hidden?: boolean;
  category: ToolCategory;
  relatedTools?: (string | { id: string; reason: string })[];
  seoKeywords?: string[];
  howToUse?: string[];
  faq?: { question: string; answer: string }[];
  nameTranslations?: Record<string, string>;
  descriptionTranslations?: Record<string, string>;
}

/** Resolve relatedTools to an array of {id, reason}, skipping hidden tools */
export function getRelatedTools(tool: Tool): { id: string; reason?: string }[] {
  if (!tool.relatedTools) return [];
  return tool.relatedTools
    .map((entry) => {
      if (typeof entry === "string") return { id: entry };
      return entry;
    })
    .filter((e) => {
      const t = tools.find((x) => x.id === e.id);
      return t && !t.hidden;
    });
}

/** Generate metadata for a tool page */
export async function generateToolMetadata(toolId: string, locale: string, dict: Record<string, unknown>) {
  const tool = tools.find((t) => t.id === toolId);
  const localeTools = (dict as any)?.tools?.[toolId] || {};
  const name = localeTools.name || tool?.name || "";
  const desc = localeTools.description || tool?.description || "";
  const keywords = tool?.seoKeywords?.join(", ") || "";
  const title = `${name} — AI ToolBox Online`;
  const url = `https://ai.toolboxonline.club/${locale}/tools/${toolId}`;
  return {
    title,
    description: desc,
    keywords,
    openGraph: { title, description: desc, url, type: "website" as const },
    twitter: { card: "summary_large_image" as const, title, description: desc },
  };
}

export const CATEGORIES: { id: ToolCategory; icon: string; nameKey: string }[] = [
  { id: "image-generation", icon: "🎨", nameKey: "categoryImageGeneration" },
  { id: "image-editing", icon: "✂️", nameKey: "categoryImageEditing" },
  { id: "content-creation", icon: "📝", nameKey: "categoryContentCreation" },
  { id: "document", icon: "📄", nameKey: "categoryDocument" },
];

export const tools: Tool[] = [
  {
    id: "ai-image-generator",
    name: "AI Image Generator",
    description: "Turn text into stunning AI images with SDXL. No watermark, instant download in JPG, PNG, and WebP. Choose from 3 quality levels, 3 aspect ratios, and 1-4 output images per generation. Supports reference images for style guidance. Create photorealistic images, digital art, and illustrations from simple text prompts.",
    icon: "🎨",
    path: "/tools/ai-image-generator",
    creditCost: 1,
    badge: "New",
    category: "image-generation",
    relatedTools: [{id:"style-transfer",reason:"Apply artistic styles to your AI-generated images"}, {id:"image-upscaler",reason:"Upscale AI images to HD resolution without quality loss"}, {id:"background-remover",reason:"Remove backgrounds from AI-generated images"}],
    seoKeywords: ["ai image generator", "text to image", "ai art", "sdxl image generator"],
    howToUse: [
      "Upload a photo you want to transform — portraits, landscapes, and architectural photos work well.",
      "Select one of 6 artistic styles: Oil Painting, Watercolor, Sketch, Cartoon, Cyberpunk, or Fantasy.",
      "Optionally add a text description to fine-tune the style application (e.g., \"warm sunset colors\").",
      "Click Generate and wait 10-20 seconds. Download your stylized artwork.",
    ],
    faq: [
      { question: "What styles are available and what do they look like?", answer: "6 styles: Oil Painting (rich brushstrokes, classical art feel), Watercolor (soft washes, artistic), Sketch (pencil/charcoal drawing), Cartoon (animated style), Cyberpunk (neon-lit futuristic), and Fantasy (ethereal, magical). Each uses IP-Adapter + ControlNet for consistent results." },
      { question: "How is this different from the AI Image Generator?", answer: "Style Transfer transforms an existing photo by applying an artistic style while preserving the original composition and subject. AI Image Generator creates entirely new images from text prompts. Use Style Transfer when you want to restyle a specific photo." },
      { question: "What photos work best for style transfer?", answer: "Photos with clear subjects and good contrast produce the best results. Portraits, landscapes, and architectural shots with distinct shapes transfer well. Avoid very dark or low-contrast images — the AI needs visible structure to work with." },
      { question: "Can I use a custom style or reference image?", answer: "Currently 6 preset styles are available, each optimized for consistent results. The optional text prompt lets you fine-tune colors, mood, and details within the chosen style." },
    ],
    nameTranslations: { es: "Generador de Imágenes IA", ar: "مولد الصور بالذكاء الاصطناعي" },
    descriptionTranslations: { es: "Convierte texto en impresionantes imágenes con IA.", ar: "حول النص إلى صور مذهلة بالذكاء الاصطناعي." },
  },
  {
    id: "avatar-generator",
    name: "AI Avatar Generator",
    description: "Transform your photos into 6 unique AI avatar styles — 3D Cartoon, Anime, Professional, Pixel Art, Watercolor, and Sketch. Uses SDXL with per-style prompts for consistent high-quality results. Upload a clear front-facing photo and get 4 avatar variations. Perfect for social media profiles, gaming, and creative projects.",
    icon: "👤",
    path: "/tools/avatar-generator",
    creditCost: 5,
    badge: "Popular",
    category: "image-generation",
    relatedTools: [{id:"background-remover",reason:"Remove backgrounds from your new avatar"}, {id:"style-transfer",reason:"Apply artistic styles to your generated avatar"}],
    seoKeywords: ["avatar generator", "ai avatar", "cartoon avatar", "anime avatar"],
    howToUse: [
      "Upload a clear, front-facing photo with even lighting — avoid shadows, hats, or obstructed faces.",
      "Select one of 6 avatar styles: 3D Cartoon, Anime, Professional, Pixel Art, Watercolor, or Sketch.",
      "Click Generate and the AI creates 4 avatar variations using per-style optimized SDXL prompts.",
      "Download all 4 avatar variations in high resolution for social media, gaming, or professional profiles.",
    ],
    faq: [
      { question: "What photo works best for avatar generation?", answer: "A clear, front-facing portrait with good lighting and a neutral background works best. Avoid group photos, sunglasses, hats, or extreme angles. The AI needs a clear view of your facial features to generate accurate avatars." },
      { question: "What styles are available and which should I choose?", answer: "6 styles: 3D Cartoon (Pixar-like, social media), Anime (Japanese animation), Professional (corporate headshot), Pixel Art (retro gaming), Watercolor (artistic painted look), and Sketch (pencil drawing). Each uses a dedicated SDXL prompt tuned for that aesthetic." },
      { question: "How many avatar variations do I get?", answer: "4 variations per generation. The AI creates 4 different outputs from the same photo and style so you can pick your favorite. All 4 are included in the 5-credit cost." },
      { question: "How many credits does it cost?", answer: "5 credits per generation (includes all 4 variations). This is higher than some tools because avatar generation runs multiple SDXL inferences with optimized per-style prompts for consistent quality." },
    ],
    nameTranslations: { es: "Generador de Avatares IA", ar: "مولد الصور الرمزية" },
    descriptionTranslations: { es: "Transforma tus fotos en avatares de dibujos, anime o profesionales.", ar: "حول صورك إلى صور رمزية كرتونية أو أنمي أو احترافية." },
  },
  {
    id: "background-remover",
    name: "Background Remover",
    description: "Remove image backgrounds instantly with one click.",
    icon: "✂️",
    path: "/tools/background-remover",
    creditCost: 2,
    badge: "Free",
    category: "image-editing",
    relatedTools: [{id:"object-remover",reason:"Remove unwanted objects after cleaning the background"}, {id:"ai-image-generator",reason:"Generate new images with transparent backgrounds"}, {id:"photo-restorer",reason:"Restore old photos after removing backgrounds"}],
    seoKeywords: ["remove background", "background remover", "ai background removal", "transparent background"],
    howToUse: [
      "Upload a photo with unwanted objects, people, text, logos, or blemishes.",
      "Paint a red mask over the areas you want removed — rough strokes work, don't need pixel precision.",
      "Click Remove and the AI (BRIA Eraser inpainting) fills the masked area with context-aware content.",
      "Review the result and download your cleaned-up photo. Re-mask and re-process if needed.",
    ],
    faq: [
      { question: "What can I remove from my photos?", answer: "People, objects, text, logos, blemishes, power lines, date stamps — anything you paint over. The AI fills the area with content that matches the surrounding image using BRIA Eraser inpainting technology." },
      { question: "How is this different from Watermark Remover?", answer: "Watermark Remover auto-detects watermarks and logos using Florence-2 vision AI — best for text/logos. Object Remover lets you manually paint what to remove — ideal for larger objects, people, and irregular areas. Both use BRIA Eraser for the actual inpainting." },
      { question: "How should I paint the mask for best results?", answer: "Rough red strokes covering the object work best. Include a small margin around the object. The AI needs some surrounding context to fill naturally. Avoid hairline-precise masking — it's counterproductive." },
      { question: "What if the first result isn't perfect?", answer: "You can re-process unlimited times within the same session. If the AI fill looks unnatural, try masking a slightly larger area, or break a large object into smaller sections and remove them one at a time." },
    ],
    nameTranslations: { es: "Eliminador de Fondos", ar: "مزيل الخلفية" },
    descriptionTranslations: { es: "Elimina fondos de imágenes al instante con un clic.", ar: "أزل خلفيات الصور فورًا بنقرة واحدة." },
  },
  {
    id: "watermark-remover",
    name: "Watermark Remover",
    description: "Erase watermarks, logos, text overlays, and timestamp stamps from images using BRIA Eraser AI inpainting. Canvas mask tool for precise removal area selection with adjustable brush size. Works on semi-transparent watermarks, logo stamps, and photo-bombing objects.",
    icon: "🖌️",
    path: "/tools/watermark-remover",
    creditCost: 3,
    category: "image-editing",
    relatedTools: [{id:"object-remover",reason:"Remove watermarks and unwanted objects from photos"}, {id:"background-remover",reason:"Remove entire photo backgrounds along with watermarks"}],
    seoKeywords: ["remove watermark", "watermark remover", "erase logo", "remove text from image"],
    howToUse: [
      "Upload an image with watermarks, logos, timestamp stamps, or unwanted text overlays.",
      "Use Auto Detect for the AI to find and remove watermarks automatically, or paint a red mask for manual precision.",
      "For manual mode, paint over the watermark area with the brush tool — rough strokes work best.",
      "Click Remove and download your cleaned image — the AI fills removed areas naturally.",
    ],
    faq: [
      { question: "Can it remove any watermark?", answer: "The AI works best on semi-transparent watermarks, logos, and text overlays. Large opaque watermarks may require manual masking. The tool uses BRIA Eraser inpainting which fills removed areas with context-aware content." },
      { question: "What's the difference between Auto Detect and Manual masking?", answer: "Auto Detect uses Florence-2 vision AI to find watermarks automatically — best for typical corner/center watermarks. Manual mode gives you full control with a paintbrush for irregular watermarks or when Auto doesn't find them." },
      { question: "How should I paint the mask for best results?", answer: "Rough strokes over the watermark area work best. Don't worry about pixel-perfect edges — the AI uses surrounding context to fill naturally. Cover the entire watermark plus a small margin around it." },
      { question: "How many credits does watermark removal cost?", answer: "3 credits per image. This covers both the detection step (Florence-2 vision model) and the removal step (BRIA Eraser inpainting)." },
    ],
    nameTranslations: { es: "Eliminador de Marcas de Agua", ar: "مزيل العلامات المائية" },
    descriptionTranslations: { es: "Borra marcas de agua, logotipos y texto de imágenes inteligentemente.", ar: "امح العلامات المائية والشعارات والنص من الصور بذكاء." },
  },
  {
    id: "photo-restorer",
    name: "Photo Restorer",
    description: "Restore and colorize old, blurry, or damaged photos.",
    icon: "📷",
    path: "/tools/photo-restorer",
    creditCost: 5,
    category: "image-editing",
    relatedTools: [{id:"colorizer",reason:"Colorize restored black and white vintage photos"}, {id:"image-upscaler",reason:"Upscale restored photos to HD resolution"}],
    seoKeywords: ["photo restoration", "restore old photo", "photo colorizer", "ai photo repair"],
    howToUse: [
      "Upload a black and white photo — old family portraits, historical images, or artistic B&W shots.",
      "Optionally select a color style (Natural, Vibrant, Portrait, Classic) and add a description like 'blue sky, green grass'.",
      "Click Generate and the AI colorizes your photo in 10-20 seconds using FLUX Kontext Pro.",
      "Toggle between Before/After to see the transformation, then download your colorized photo.",
    ],
    faq: [
      { question: "What types of photos colorize best?", answer: "Clear, well-lit black and white photos produce the most accurate results. Portraits, landscapes, and historical photos all colorize well. The AI uses context — skin tones, sky, vegetation — to assign realistic colors." },
      { question: "How is this different from Photo Restorer?", answer: "Photo Restorer repairs physical damage like scratches, dust, and fading using Topaz AI. Colorizer adds realistic color to B&W photos using FLUX Kontext Pro. Best workflow: restore first to fix damage, then colorize to add life." },
      { question: "How do I get the best colorization results?", answer: "Choose a style that matches your photo (Natural for everyday, Vibrant for landscapes, Portrait for faces, Classic for vintage). Add an optional text description to guide specific colors — 'navy blue jacket, golden sunset, green trees'." },
      { question: "Can it colorize any black and white image?", answer: "Yes — vintage family photos, historical images, artistic B&W photography, and even screenshots. The AI understands context (grass should be green, sky should be blue) but you can override with text descriptions for creative effects." },
    ],
    nameTranslations: { es: "Restaurador de Fotos", ar: "مُستعِد الصور" },
    descriptionTranslations: { es: "Restaura y colorea fotos antiguas, borrosas o dañadas.", ar: "استعد ولون الصور القديمة أو التالفة." },
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Convert PDF to editable Word (.docx) free — no watermarks, no registration. Smart text extraction preserves headings, paragraphs, and formatting. Auto-detects and converts PDF tables. Scanned PDF support with Google Cloud Vision OCR text extraction. Embedded images preserved in output.",
    icon: "📄",
    path: "/tools/pdf-to-word",
    creditCost: 0,
    free: true,
    hidden: true,
    category: "document",
    relatedTools: [{id:"text-polish",reason:"Polish converted PDF text for better readability"}, {id:"article-generator",reason:"Generate articles from converted PDF research"}],
    seoKeywords: ["pdf to word", "pdf converter", "pdf to docx", "free pdf conversion"],
    howToUse: [
      "Enter a specific topic — be detailed for better results. Instead of 'marketing', try 'how AI is transforming small business marketing in 2026'.",
      "Optionally add keywords to guide the content focus and select a tone (Neutral, Professional, Casual, etc.).",
      "Set your desired word count (50-5000 words) using the slider or manual input.",
      "Click Generate and the AI writes a structured article with title, introduction, 3-5 main sections, and conclusion.",
      "Review the article, copy to clipboard, or download as a text file for further editing.",
    ],
    faq: [
      { question: "How do I get the best article results?", answer: "Be specific with your topic. Include keywords relevant to your niche. Choose the right tone for your audience — Professional for business, Casual for blog readers, Academic for research. The AI adapts structure and vocabulary based on your inputs." },
      { question: "How long are the generated articles?", answer: "You control the length — set 50 to 5000 words. The AI generates articles with proper structure at any length: title, compelling introduction, 3-5 main sections with subheadings, and a conclusion with key takeaways." },
      { question: "Can I use the generated articles commercially?", answer: "Yes. All content you generate belongs to you. Use it on your blog, website, newsletter, social media, or anywhere you need original content. There are no usage restrictions or attribution requirements." },
      { question: "How is this different from Text Polish?", answer: "Article Generator creates complete, structured articles from a topic and keywords — it's for original content creation. Text Polish refines existing text — fixing grammar, rewriting, shortening, or expanding. Use Article Generator to create drafts, then Text Polish to polish the language." },
      { question: "What AI model powers this tool?", answer: "Meta Llama 3 70B — one of the most capable open-source language models. It produces coherent, well-structured long-form content with natural human-like writing. The model supports English, Spanish, and Arabic natively." },
    ],
    nameTranslations: { es: "PDF a Word", ar: "PDF إلى Word" },
    descriptionTranslations: { es: "Convierte documentos PDF a archivos Word (.docx) editables.", ar: "حول مستندات PDF إلى ملفات Word (.docx) قابلة للتحرير." },
  },
  {
    id: "image-upscaler",
    name: "Image Upscaler",
    description: "Increase image resolution up to 4x with Real-ESRGAN AI upscaling. Dedicated Photo and Anime modes for different image types. Choose 2x or 4x upscaling factor. Enhances old photos, AI-generated images, and low-res pictures to HD quality without losing detail. Perfect for printing and digital displays.",
    icon: "🔍",
    path: "/tools/image-upscaler",
    creditCost: 2,
    badge: "New",
    category: "image-editing",
    relatedTools: [{id:"ai-image-generator",reason:"Generate high-res AI images to upscale further"}, {id:"avatar-generator",reason:"Upscale AI avatars to 4K resolution"}, {id:"photo-restorer",reason:"Restore and upscale old damaged photos"}],
    seoKeywords: ["image upscaler", "upscale image", "ai upscale", "increase image resolution"],
    howToUse: [
      "Upload an image you want to enlarge.",
      "Choose Photo or Anime mode for best results.",
      "Select 2x or 4x upscaling factor.",
      "Download your high-resolution image.",
    ],
    faq: [
      { question: "How much can I upscale an image?", answer: "2x or 4x the original resolution. For best results, start with a reasonably clear image." },
    ],
    nameTranslations: { es: "Ampliador de Imágenes", ar: "مُكبِر الصور" },
    descriptionTranslations: { es: "Amplía imágenes a mayor resolución con IA.", ar: "كبر الصور إلى دقة أعلى بالذكاء الاصطناعي." },
  },
  {
    id: "style-transfer",
    name: "Style Transfer",
    description: "Apply artistic styles to your photos using AI.",
    icon: "🎭",
    path: "/tools/style-transfer",
    creditCost: 4,
    badge: "New",
    category: "image-generation",
    relatedTools: [{id:"background-remover",reason:"Remove backgrounds before applying artistic styles"}, {id:"photo-restorer",reason:"Restore old photos then apply artistic style transfer"}, {id:"ai-image-generator",reason:"Generate base images for style transformation"}],
    seoKeywords: ["style transfer", "ai art style", "photo to art", "neural style transfer"],
    howToUse: [
      "Upload a photo you want to stylize.",
      "Select one of 6 artistic styles.",
      "Click Generate and wait for the style to be applied.",
      "Download your stylized image.",
    ],
    faq: [
      { question: "What styles are available?", answer: "6 styles: Oil Painting, Watercolor, Sketch, Anime, Cyberpunk, and Vintage." },
    ],
    nameTranslations: { es: "Transferencia de Estilo", ar: "نقل النمط" },
    descriptionTranslations: { es: "Aplica estilos artísticos a tus fotos usando IA.", ar: "طبق أنماطًا فنية على صورك بالذكاء الاصطناعي." },
  },
  {
    id: "text-polish",
    name: "Text Polish & Rewrite",
    description: "Polish, rewrite, shorten, or expand your text with AI.",
    icon: "✨",
    path: "/tools/text-polish",
    creditCost: 3,
    badge: "New",
    category: "content-creation",
    relatedTools: [{id:"article-generator",reason:"Generate full articles then polish the language"}, {id:"text-to-speech",reason:"Convert polished text to natural-sounding speech"}],
    seoKeywords: ["text polisher", "ai rewrite", "text improver", "ai writing assistant"],
    howToUse: [
      "Type or paste up to 2000 characters of text you want to convert to speech.",
      "Select a language for proper pronunciation and natural voice output.",
      "Click Generate and the AI synthesizes the audio — typically 10-15 seconds.",
      "Play the audio preview directly in your browser, then download the MP3 file.",
    ],
    faq: [
      { question: "What languages are supported for text-to-speech?", answer: "17 languages: English, Spanish, Arabic, French, German, Italian, Japanese, Chinese, Korean, Portuguese, Russian, Turkish, Polish, Dutch, Czech, Hindi, and Hungarian. Powered by MiniMax speech-2.6-turbo for natural-sounding output." },
      { question: "How long can the text be?", answer: "Up to 2000 characters per generation. For longer texts like articles or scripts, break them into segments of 2000 characters or less and process each separately." },
      { question: "What audio format does it produce?", answer: "MP3 format — universally compatible with all media players, smartphones, podcast platforms, and video editing software. No special codecs needed." },
      { question: "How natural does the AI voice sound?", answer: "MiniMax speech-2.6-turbo produces highly natural speech with proper intonation, pacing, and emotion. It's significantly better than older TTS systems — most listeners can't tell it's AI-generated." },
      { question: "Can I choose different voices?", answer: "Voice selection is currently limited. The tool uses optimized default voices per language for consistent quality. Multi-voice support is on the roadmap for future updates." },
    ],
    nameTranslations: { es: "Pulidor de Texto", ar: "مُنقح النصوص" },
    descriptionTranslations: { es: "Pule, reescribe, acorta o expande tu texto con IA.", ar: "صقل أو أعد كتابة أو اختصر أو وسع نصك بالذكاء الاصطناعي." },
  },
  {
    id: "face-blur",
    name: "AI Face Privacy Blur",
    description: "Auto-detect faces and apply privacy blur — mosaic, gaussian, pixelate, or cute emoji overlays. Uses Grounding DINO AI for face detection. Manual blur region support with undo. 4-step process: upload, detect, choose style, download. Ideal for journalism and sharing photos while protecting privacy.",
    icon: "😷",
    path: "/tools/face-blur",
    creditCost: 2,
    badge: "New",
    category: "image-editing",
    relatedTools: [{id:"background-remover",reason:"Remove backgrounds before privacy blurring"}, {id:"image-description",reason:"Describe images after applying face blur for privacy"}],
    seoKeywords: ["face blur", "privacy blur", "face pixelation", "blur faces online", "face mosaic", "hide face in photo", "ai face detection", "privacy photo tool"],
    howToUse: [
      "Upload a photo containing faces you want to obscure — group photos, event shots, or street photography.",
      "The AI (Grounding DINO) automatically detects all faces in the image within seconds.",
      "Choose a blur style: Mosaic (pixelated blocks), Gaussian (smooth blur), Pixelate (color blocks), or Emoji (cute overlays).",
      "Toggle Preview to compare before/after. Add manual blur regions by clicking and dragging for extra coverage.",
      "Click Download to save the processed image as lossless PNG.",
    ],
    faq: [
      { question: "How does face detection work?", answer: "We use Grounding DINO — a state-of-the-art zero-shot object detection model. It detects faces with high accuracy even in group photos, side profiles, and partially obscured faces. The AI runs on GPU for fast processing." },
      { question: "Can I manually add blur regions?", answer: "Yes. Use the manual selection tool to draw rectangles over any area you want to obscure — faces the AI missed, license plates, logos, or any sensitive content. You can also remove individual regions with Undo or Clear All." },
      { question: "What blur styles are available?", answer: "Four styles: Mosaic (classic pixelated blocks), Gaussian (smooth lens blur), Pixelate (cell-based color averaging), and Emoji (cute Twemoji face overlays). Each provides different levels of privacy protection and visual appeal." },
      { question: "How many credits does it cost?", answer: "Standard images (up to 3000px, under 5 faces): 2 credits. High-resolution (>3000px) or 5+ faces: 4 credits. The cost covers both face detection and blur processing." },
      { question: "Is this suitable for journalism and privacy compliance?", answer: "Yes. Journalists and content creators use this tool to protect identities in photos before publishing. The blur is irreversible — processed faces cannot be unblurred — making it suitable for privacy-sensitive contexts." },
    ],
    nameTranslations: { es: "Difuminado Facial IA", ar: "تمويه الوجه بالذكاء الاصطناعي" },
    descriptionTranslations: { es: "Detecta rostros automáticamente y aplica desenfoque mosaico, gaussiano o pixelado.", ar: "اكتشف الوجوه تلقائيًا وطبق التمويه الفسيفسائي أو الغاوسي أو المنقط." },
  },
  {
    id: "text-to-speech",
    name: "AI Text to Speech",
    description: "Convert text to natural speech in 17 languages using MiniMax speech AI. No file upload needed — just paste text and get instant MP3 audio. Supports up to 2000 characters per conversion. Perfect for voiceovers, podcast content, e-learning, and audio versions of articles.",
    icon: "🎙️",
    path: "/tools/text-to-speech",
    creditCost: 3,
    badge: "New",
    category: "content-creation",
    relatedTools: [{id:"article-generator",reason:"Generate articles and blog posts to convert to audio"}, {id:"text-polish",reason:"Polish text for better speech quality and natural flow"}],
    seoKeywords: ["text to speech", "ai voice generator", "text to audio", "tts", "speech synthesis"],
    howToUse: [
      "Type or paste the text you want to convert to speech.",
      "Select a language for proper pronunciation.",
      "Click Generate and wait for the AI to synthesize the audio.",
      "Play the audio preview or download the WAV file.",
    ],
    faq: [
      { question: "What languages are supported?", answer: "40+ languages including English, Spanish, Arabic, French, German, Italian, Japanese, Chinese, Korean, Portuguese, Russian, Turkish, Polish, Dutch, Czech, Hindi, and Hungarian." },
      { question: "How long can the text be?", answer: "Up to 2000 characters per generation. For longer texts, break them into smaller segments." },
      { question: "What format is the audio?", answer: "MP3 format — universal compatibility with all media players, phones, and editing software." },
    ],
    nameTranslations: { es: "Texto a Voz IA", ar: "النص إلى كلام" },
    descriptionTranslations: { es: "Convierte texto en voz natural con IA.", ar: "حول النص إلى كلام طبيعي بالذكاء الاصطناعي." },
  },
  {
    id: "image-description",
    name: "AI Image Describer",
    description: "Generate detailed image descriptions, alt text, and captions with AI vision.",
    icon: "🖼️",
    path: "/tools/image-description",
    creditCost: 2,
    badge: "New",
    category: "content-creation",
    relatedTools: [{id:"ai-image-generator",reason:"Generate images that match your descriptions"}, {id:"background-remover",reason:"Remove backgrounds from images before describing"}, {id:"photo-restorer",reason:"Restore and describe old vintage photographs"}],
    seoKeywords: ["image description", "alt text generator", "ai image caption", "image to text", "photo description"],
    howToUse: [
      "Upload an image you want to describe.",
      "Optionally add a custom question or instruction for the AI.",
      "Click Generate and the AI will analyze your image.",
      "Get an ALT text for SEO and a detailed description of the image.",
    ],
    faq: [
      { question: "What does the AI analyze?", answer: "Powered by Meta Llama 3.2 Vision — it identifies objects, people, colors, composition, setting, mood, text, and more to generate accurate descriptions." },
      { question: "Can I ask specific questions about the image?", answer: "Yes! Use the optional prompt field to ask custom questions like 'What brand is the car?' or 'Describe the facial expression.'" },
      { question: "Is this good for SEO?", answer: "Absolutely. The ALT text format is specifically designed for image SEO and accessibility compliance." },
    ],
    nameTranslations: { es: "Descriptor de Imágenes IA", ar: "واصف الصور بالذكاء الاصطناعي" },
    descriptionTranslations: { es: "Genera descripciones detalladas, texto ALT y más con IA.", ar: "أنشئ أوصافًا مفصلة ونص ALT والمزيد بالذكاء الاصطناعي." },
  },
  {
    id: "colorizer",
    name: "B&W Photo Colorizer",
    description: "Bring black and white photos to life with natural, vibrant AI colorization.",
    icon: "🎨",
    path: "/tools/colorizer",
    creditCost: 2,
    badge: "New",
    category: "image-editing",
    relatedTools: [{id:"photo-restorer",reason:"Restore damaged photos before adding color"}, {id:"image-upscaler",reason:"Upscale colorized black and white photos to HD"}],
    seoKeywords: ["colorize black and white photo", "ai colorizer", "bw to color", "photo colorization", "colorize old photos"],
    howToUse: [
      "Upload a black and white photo.",
      "Click Generate and watch the AI bring it to life with color.",
      "Toggle between before/after to see the transformation.",
      "Download your colorized photo in high resolution.",
    ],
    faq: [
      { question: "What types of photos work best?", answer: "Clear, well-lit black and white photos produce the best results. Portraits, landscapes, and historical photos all colorize well." },
      { question: "How is this different from Photo Restorer?", answer: "Photo Restorer repairs damage like scratches and fading. Colorizer uses FLUX Kontext Pro — a state-of-the-art AI that adds realistic color while preserving every detail of the original photo." },
      { question: "How do I get the best colorization results?", answer: "Choose a style that matches your photo. Add an optional description like 'blue sky, green grass, red car' to guide the AI. More specific descriptions produce more accurate colors." },
      { question: "Can it colorize any black and white image?", answer: "Yes — old photos, historical images, artistic B&W photos, and even screenshots. The AI understands context to assign plausible colors." },
    ],
    nameTranslations: { es: "Colorizador de Fotos B&N", ar: "تلوين الصور بالأبيض والأسود" },
    descriptionTranslations: { es: "Da vida a fotos en blanco y negro con colorización IA.", ar: "أضف الحياة للصور بالأبيض والأسود بتلوين ذكي." },
  },
  {
    id: "object-remover",
    name: "AI Object Remover",
    description: "Remove unwanted objects, people, or text from photos with AI inpainting.",
    icon: "🧹",
    path: "/tools/object-remover",
    creditCost: 3,
    badge: "New",
    category: "image-editing",
    relatedTools: [{id:"background-remover",reason:"Remove entire photo backgrounds in one click"}, {id:"watermark-remover",reason:"Remove watermarks and overlaid text from images"}],
    seoKeywords: ["remove objects from photo", "ai object remover", "remove person from photo", "inpainting", "clean up photos"],
    howToUse: [
      "Upload a photo with unwanted objects, people, or text.",
      "Paint a mask over the areas you want to remove.",
      "Click Remove and the AI will fill the area naturally.",
      "Download your cleaned-up photo.",
    ],
    faq: [
      { question: "What can I remove?", answer: "People, objects, text, logos, blemishes, power lines — anything you paint over. The AI fills the area with context-aware content." },
      { question: "How is this different from Watermark Remover?", answer: "Watermark Remover auto-detects watermarks and logos. Object Remover lets you manually paint what to remove — ideal for larger or irregular objects." },
      { question: "How should I paint the mask?", answer: "Rough strokes over the object work best. The AI needs some surrounding context to fill naturally. Avoid pixel-precise masking." },
    ],
    nameTranslations: { es: "Eliminador de Objetos IA", ar: "مزيل الكائنات بالذكاء الاصطناعي" },
    descriptionTranslations: { es: "Elimina objetos, personas o texto no deseados de tus fotos.", ar: "أزل الكائنات أو الأشخاص أو النصوص غير المرغوب فيها من صورك." },
  },
  {
    id: "article-generator",
    name: "AI Article Generator",
    description: "Generate complete, well-structured articles from a topic and keywords with AI.",
    icon: "📝",
    path: "/tools/article-generator",
    creditCost: 3,
    badge: "New",
    category: "content-creation",
    relatedTools: [{id:"text-polish",reason:"Polish and refine AI-generated articles for clarity and tone"}, {id:"text-to-speech",reason:"Turn your generated articles into natural audio narration"}],
    seoKeywords: ["article generator", "ai writer", "content generator", "blog post writer", "seo article tool"],
    howToUse: [
      "Enter a topic for your article — be specific for best results.",
      "Optionally add keywords and select a tone (Neutral, Professional, Casual, etc.).",
      "Click Generate and the AI will write a structured article with title, sections, and conclusion.",
      "Review the article, copy to clipboard, or download as a text file.",
    ],
    faq: [
      { question: "How do I get the best results?", answer: "Be specific with your topic. Instead of 'marketing', try 'how AI is transforming small business marketing in 2026'. Adding relevant keywords helps too." },
      { question: "How long are the generated articles?", answer: "Articles are typically 500-1500 words with 3-5 main sections. The AI adapts length based on topic complexity." },
      { question: "Can I use the articles commercially?", answer: "Yes! Content you generate belongs to you. Use it on your blog, website, or anywhere you need content." },
    ],
    nameTranslations: { es: "Generador de Artículos IA", ar: "مولد المقالات بالذكاء الاصطناعي" },
    descriptionTranslations: { es: "Genera artículos completos y bien estructurados a partir de un tema con IA.", ar: "أنشئ مقالات كاملة ومنظمة من موضوعك باستخدام الذكاء الاصطناعي." },
  },
];
