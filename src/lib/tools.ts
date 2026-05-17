export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  creditCost: number;
  free?: boolean;
  badge?: string;
  seoKeywords?: string[];
  howToUse?: string[];
  faq?: { question: string; answer: string }[];
  nameTranslations?: Record<string, string>;
  descriptionTranslations?: Record<string, string>;
}

export const tools: Tool[] = [
  {
    id: "ai-image-generator",
    name: "AI Image Generator",
    description: "Turn text into stunning AI images. No watermark, instant download.",
    icon: "🎨",
    path: "/tools/ai-image-generator",
    creditCost: 1,
    badge: "New",
    seoKeywords: ["ai image generator", "text to image", "ai art", "sdxl image generator"],
    howToUse: [
      "Write a detailed prompt describing the image you want to create.",
      "Select quality (Low/Medium/High), aspect ratio, and output format.",
      "Optionally upload a reference image for style guidance.",
      "Click Generate and wait for the AI to create your image.",
      "Download your generated image in your chosen format.",
    ],
    faq: [
      { question: "How does AI image generation work?", answer: "Our tool uses Stability AI's SDXL model to generate images from text prompts. It can also use reference images for style guidance." },
      { question: "What quality should I choose?", answer: "Low is fastest and cheapest. High produces the best detail but costs more credits and takes longer. Medium is a good balance." },
    ],
    nameTranslations: { es: "Generador de Imágenes IA", ar: "مولد الصور بالذكاء الاصطناعي" },
    descriptionTranslations: { es: "Convierte texto en impresionantes imágenes con IA.", ar: "حول النص إلى صور مذهلة بالذكاء الاصطناعي." },
  },
  {
    id: "avatar-generator",
    name: "AI Avatar Generator",
    description: "Transform your photos into cartoon, anime, or professional avatars.",
    icon: "👤",
    path: "/tools/avatar-generator",
    creditCost: 5,
    badge: "Popular",
    seoKeywords: ["avatar generator", "ai avatar", "cartoon avatar", "anime avatar"],
    howToUse: [
      "Upload a clear front-facing photo of yourself.",
      "Select an avatar style (Cartoon, Anime, Professional, etc.).",
      "Click Generate and wait for your avatar to be created.",
      "Download your new avatar in high resolution.",
    ],
    faq: [
      { question: "What photo works best?", answer: "A clear, front-facing photo with good lighting and no obstructions produces the best results." },
      { question: "How many styles are available?", answer: "6 styles: 3D Cartoon, Anime, Professional, Pixel Art, Watercolor, and Sketch." },
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
    seoKeywords: ["remove background", "background remover", "ai background removal", "transparent background"],
    howToUse: [
      "Upload an image with a background you want to remove.",
      "Choose Auto mode for one-click removal, or Manual mode to paint areas to keep.",
      "Download the result with a transparent background.",
    ],
    faq: [
      { question: "What image formats are supported?", answer: "PNG, JPG, and WebP images up to 10MB." },
      { question: "How does Manual mode work?", answer: "Paint green strokes on areas you want to keep. The AI will process only those areas for precise background removal." },
    ],
    nameTranslations: { es: "Eliminador de Fondos", ar: "مزيل الخلفية" },
    descriptionTranslations: { es: "Elimina fondos de imágenes al instante con un clic.", ar: "أزل خلفيات الصور فورًا بنقرة واحدة." },
  },
  {
    id: "watermark-remover",
    name: "Watermark Remover",
    description: "Erase watermarks, logos, and text from images intelligently.",
    icon: "🖌️",
    path: "/tools/watermark-remover",
    creditCost: 3,
    seoKeywords: ["remove watermark", "watermark remover", "erase logo", "remove text from image"],
    howToUse: [
      "Upload an image with watermarks or unwanted objects.",
      "The AI will automatically detect and remove watermarks.",
      "For precise control, paint a mask over the area to remove.",
      "Download the cleaned image.",
    ],
    faq: [
      { question: "Can it remove any watermark?", answer: "The AI works best on semi-transparent watermarks and logos. Complex or opaque watermarks may require manual masking for best results." },
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
    seoKeywords: ["photo restoration", "restore old photo", "photo colorizer", "ai photo repair"],
    howToUse: [
      "Upload a damaged or old photo.",
      "Choose Auto mode for scratch/dust removal, or Face Pro for face enhancement.",
      "Download your restored photo.",
    ],
    faq: [
      { question: "Can it restore very damaged photos?", answer: "The AI can handle moderate damage like scratches and fading. Severely damaged photos may show limited improvement." },
    ],
    nameTranslations: { es: "Restaurador de Fotos", ar: "مُستعِد الصور" },
    descriptionTranslations: { es: "Restaura y colorea fotos antiguas, borrosas o dañadas.", ar: "استعد ولون الصور القديمة أو التالفة." },
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Convert PDF documents to editable Word (.docx) files.",
    icon: "📄",
    path: "/tools/pdf-to-word",
    creditCost: 0,
    free: true,
    seoKeywords: ["pdf to word", "pdf converter", "pdf to docx", "free pdf conversion"],
    howToUse: [
      "Upload a PDF file (up to 20MB).",
      "For text-based PDFs, the text and formatting will be extracted automatically.",
      "For scanned/image-based PDFs, pages are embedded as images in the Word document.",
      "Download the .docx file and edit in Microsoft Word or Google Docs.",
    ],
    faq: [
      { question: "Is PDF to Word really free?", answer: "Yes! Text-based PDF conversion uses local processing and costs 0 credits. Scanned PDFs are also free — pages are embedded as images." },
      { question: "Can it handle scanned PDFs?", answer: "Yes, scanned PDFs are supported. Pages are rendered as images and placed into the Word document. OCR text extraction is not currently available." },
    ],
    nameTranslations: { es: "PDF a Word", ar: "PDF إلى Word" },
    descriptionTranslations: { es: "Convierte documentos PDF a archivos Word (.docx) editables.", ar: "حول مستندات PDF إلى ملفات Word (.docx) قابلة للتحرير." },
  },
  {
    id: "image-upscaler",
    name: "Image Upscaler",
    description: "Upscale images to higher resolution with AI.",
    icon: "🔍",
    path: "/tools/image-upscaler",
    creditCost: 2,
    badge: "New",
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
    seoKeywords: ["text polisher", "ai rewrite", "text improver", "ai writing assistant"],
    howToUse: [
      "Paste or type your text in the input area.",
      "Select a mode: Polish, Shorten, Expand, Formal, Casual, or Grammar Fix.",
      "Click Polish and the AI will process your text.",
      "Copy or use the polished result.",
    ],
    faq: [
      { question: "What languages are supported?", answer: "The tool auto-detects and supports English, Spanish, and Arabic. Other languages may work but with reduced quality." },
    ],
    nameTranslations: { es: "Pulidor de Texto", ar: "مُنقح النصوص" },
    descriptionTranslations: { es: "Pule, reescribe, acorta o expande tu texto con IA.", ar: "صقل أو أعد كتابة أو اختصر أو وسع نصك بالذكاء الاصطناعي." },
  },
];
