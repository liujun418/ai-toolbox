import type { TopicData } from "@/components/TopicPage";

export const aiTopics: TopicData[] = [
  {
    id: "ai-image-editing",
    icon: "✂️",
    title: "AI Image Editing Tools",
    description: "Professional AI-powered image editing tools — remove backgrounds, watermarks, objects, and more. No software download required, all processing done online.",
    intro: "Our AI image editing suite gives you everything you need to edit photos like a pro — without the pro price tag. Remove backgrounds in one click, erase watermarks and unwanted objects, upscale low-res images to 4K, blur faces for privacy, colorize black and white photos, and restore damaged vintage pictures. All tools use state-of-the-art AI models to deliver professional results in seconds. Whether you are a photographer cleaning up product shots, a social media manager preparing content, or just someone fixing old family photos, these free online AI editing tools get the job done fast.",
    toolIds: ["background-remover", "watermark-remover", "object-remover", "image-upscaler", "face-blur", "colorizer", "photo-restorer"],
    faq: [
      { question: "What are the best free AI image editing tools?", answer: "Our AI image editing suite includes a background remover, watermark remover, object remover, image upscaler, face blur tool, B&W colorizer, and photo restorer. Each tool uses dedicated AI models for professional-quality results without any software installation." },
      { question: "How does AI background removal work?", answer: "Our background remover uses a combination of deep learning models (including BRIA RMBG) to detect foreground subjects and remove backgrounds automatically. For precise control, a manual Keep mode lets you paint areas to preserve — perfect for complex images like hair or transparent objects." },
      { question: "Can AI upscale images without losing quality?", answer: "Yes — our AI image upscaler uses Real-ESRGAN to intelligently increase resolution up to 4x while preserving and even enhancing detail. It works for both photos and anime-style images with dedicated processing modes for each." },
      { question: "Are these AI editing tools really free to use?", answer: "Each tool requires a small number of credits per use. New users get 5 free credits upon registration. The background remover, upscaler, and face blur tool cost just 2 credits each — making them accessible for casual use." },
    ],
  },
  {
    id: "ai-content-creation",
    icon: "📝",
    title: "AI Content Creation Tools",
    description: "Create, polish, and transform content with AI — generate articles, refine text, convert text to speech, and describe images automatically.",
    intro: "Our AI content creation tools help you produce high-quality written and audio content in minutes, not hours. Generate full-length articles from a topic and keywords, polish rough drafts into professional prose, convert any text into natural-sounding speech in 17 languages, and get detailed descriptions of images for accessibility and SEO. Built on powerful language models including Llama 3 70B and XTTS-v2, these tools deliver professional-grade output for bloggers, marketers, content creators, and anyone who needs to produce quality content at scale.",
    toolIds: ["article-generator", "text-polish", "text-to-speech", "image-description"],
    faq: [
      { question: "How can AI help with content creation?", answer: "AI content creation tools can generate articles from topics, polish and refine existing text, convert text to natural speech, and describe images. Our tools use large language models (Llama 3 70B) for writing tasks and neural TTS (XTTS-v2) for speech — giving you a complete content production pipeline." },
      { question: "Can AI-generated articles rank on Google?", answer: "AI-generated content can rank well when it is high-quality, original, and provides value to readers. Our article generator creates well-structured, informative articles that you can edit and customize. For best SEO results, treat AI output as a first draft and add your own expertise and personal touch." },
      { question: "What languages does the text-to-speech tool support?", answer: "Our text-to-speech tool supports 17 languages including English, Spanish, French, German, Italian, Portuguese, Japanese, Chinese, Korean, Hindi, Russian, Turkish, Polish, Dutch, Czech, Hungarian, and Arabic. The AI produces natural-sounding speech with proper intonation for each language." },
      { question: "How accurate is AI image description?", answer: "Our image description tool uses NVIDIA Nemotron Nano VL, a vision-language model that analyzes images and generates both concise ALT text (for accessibility/SEO) and detailed descriptions. It works well for photographs, product images, landscapes, and everyday scenes." },
    ],
  },
  {
    id: "ai-photo-restoration",
    icon: "📷",
    title: "AI Photo Restoration & Enhancement",
    description: "Bring old photos back to life with AI — restore damaged pictures, colorize black and white images, and upscale to HD resolution.",
    intro: "Old photos carry precious memories, but time takes its toll — scratches, fading, and low resolution degrade image quality. Our AI photo restoration toolkit reverses the damage. The Photo Restorer uses Topaz Labs' industry-leading Dust & Scratch removal and GFPGAN face enhancement to repair physical damage. The B&W Colorizer uses FLUX Kontext Pro to add realistic, context-aware color to monochrome photos. And the Image Upscaler boosts resolution up to 4x for crystal-clear prints and digital displays. Together, these three tools form a complete pipeline for breathing new life into vintage photographs.",
    toolIds: ["photo-restorer", "colorizer", "image-upscaler"],
    faq: [
      { question: "Can AI really restore old damaged photos?", answer: "Yes — modern AI models can detect and repair common photo damage like scratches, dust spots, and fading. Our Photo Restorer uses Topaz Labs' Dust & Scratch v2 model for automatic restoration and GFPGAN for facial detail enhancement. Results are best on moderate damage; severely deteriorated photos may need professional restoration." },
      { question: "How does AI colorize black and white photos?", answer: "Our B&W Colorizer uses FLUX Kontext Pro — a state-of-the-art AI model that understands image context to assign realistic colors. It recognizes objects, materials, and scenes to determine appropriate colors (blue sky, green grass, skin tones). You can optionally provide a description like 'red dress, golden sunset' to guide the AI for more accurate results." },
      { question: "What is the difference between Photo Restorer and B&W Colorizer?", answer: "Photo Restorer repairs physical damage — scratches, dust, fading — while preserving the original colors (or lack thereof). B&W Colorizer adds realistic color to black and white photos. Use Photo Restorer first to clean up damage, then Colorizer to bring the restored photo to life with color." },
    ],
  },
  {
    id: "ai-image-generation",
    icon: "🎨",
    title: "AI Image Generation Tools",
    description: "Create stunning images from text descriptions — generate original AI art, custom avatars, and artistic style transformations.",
    intro: "Turn imagination into images with our AI generation tools. The AI Image Generator uses Stability AI's SDXL model to create high-quality images from text prompts — choose from multiple aspect ratios, quality levels, and output formats. The Avatar Generator transforms your photos into six unique styles including 3D cartoon, anime, and professional portraits. Style Transfer applies artistic filters using IP-Adapter and ControlNet technology, giving your photos the look of famous art styles. Whether you need stock-free images for your website, custom social media avatars, or creative photo transformations, our AI generation tools deliver professional results.",
    toolIds: ["ai-image-generator", "avatar-generator", "style-transfer"],
    faq: [
      { question: "How does AI image generation work?", answer: "AI image generators use diffusion models (like SDXL) trained on millions of image-text pairs. You provide a text prompt describing what you want, and the AI generates a matching image from scratch. Our tool supports reference images for style guidance, multiple quality levels, and outputs in JPG, PNG, and WebP formats." },
      { question: "What makes a good AI image prompt?", answer: "Good prompts are specific and descriptive. Include details about the subject, style, lighting, composition, and mood. For example, instead of 'a cat,' try 'a orange tabby cat sitting on a windowsill, warm sunset light, photorealistic, 4K.' The more detail you provide, the better the AI can match your vision." },
      { question: "Can I use AI-generated images commercially?", answer: "Images generated with our tools may be used for both personal and commercial purposes. However, we recommend reviewing the specific license terms of the underlying AI models (SDXL by Stability AI) for any jurisdiction-specific restrictions." },
    ],
  },
];
