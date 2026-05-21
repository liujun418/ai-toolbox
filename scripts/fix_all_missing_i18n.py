"""Add ALL missing i18n keys: footer nav, home exploreMore, tool howToUse/faq translations."""
import json

# Load English tool definitions for reference
import sys
sys.path.insert(0, 'C:/Users/jun/ai-toolbox/src/lib')

# Read tools.ts manually
with open('C:/Users/jun/ai-toolbox/src/lib/tools.ts', encoding='utf-8') as f:
    tools_ts = f.read()

# Extract tool howToUse and faq by regex
import re
tool_data = {}
# Find each tool block
tool_blocks = re.findall(r'id:\s*"([^"]+)".*?howToUse:\s*\[(.*?)\],\s*faq:\s*\[(.*?)\],', tools_ts, re.DOTALL)
for tid, how, faq in tool_blocks:
    steps = re.findall(r'"([^"]*)"', how)
    faq_items = re.findall(r'question:\s*"([^"]*)"\s*,\s*answer:\s*"([^"]*)"', faq)
    if steps:
        tool_data[tid] = {
            'howToUse': steps,
            'faq': [{'question': q, 'answer': a} for q, a in faq_items]
        }

# Missing home keys
home_keys = {
    "en": {
        "exploreMore": "Explore more {category} tools →",
        "exploreMoreImageEditing": "Explore AI photo editing tools →",
        "exploreMoreContentCreation": "Explore AI content creation tools →",
        "exploreMoreImageGeneration": "Explore AI image generation tools →",
    },
    "es": {
        "exploreMore": "Explorar más herramientas de {category} →",
        "exploreMoreImageEditing": "Explorar herramientas de edición de fotos IA →",
        "exploreMoreContentCreation": "Explorar herramientas de creación de contenido IA →",
        "exploreMoreImageGeneration": "Explorar herramientas de generación de imágenes IA →",
    },
    "ar": {
        "exploreMore": "استكشف المزيد من أدوات {category} ←",
        "exploreMoreImageEditing": "استكشف أدوات تحرير الصور بالذكاء الاصطناعي ←",
        "exploreMoreContentCreation": "استكشف أدوات إنشاء المحتوى بالذكاء الاصطناعي ←",
        "exploreMoreImageGeneration": "استكشف أدوات توليد الصور بالذكاء الاصطناعي ←",
    },
}

# Footer nav keys
footer_keys = {
    "en": {
        "blog": "Blog",
        "pricing": "Pricing",
        "about": "About",
        "contact": "Contact",
        "privacy": "Privacy",
        "terms": "Terms",
        "freeTools": "Free Tools →",
        "admin": "Admin",
        "copyright": "AI ToolBox Online. All rights reserved.",
        "email": "jzerov@live.com",
    },
    "es": {
        "blog": "Blog",
        "pricing": "Precios",
        "about": "Acerca de",
        "contact": "Contacto",
        "privacy": "Privacidad",
        "terms": "Términos",
        "freeTools": "Herramientas Gratuitas →",
        "admin": "Admin",
        "copyright": "AI ToolBox Online. Todos los derechos reservados.",
        "email": "jzerov@live.com",
    },
    "ar": {
        "blog": "المدونة",
        "pricing": "الأسعار",
        "about": "حول",
        "contact": "اتصل بنا",
        "privacy": "الخصوصية",
        "terms": "الشروط",
        "freeTools": "أدوات مجانية ←",
        "admin": "المشرف",
        "copyright": "AI ToolBox Online. جميع الحقوق محفوظة.",
        "email": "jzerov@live.com",
    },
}

# Header nav keys
nav_keys = {
    "en": {
        "home": "Home",
        "blog": "Blog",
        "pricing": "Pricing",
        "about": "About",
        "login": "Log in",
        "logout": "Log out",
        "signup": "Sign up",
        "dashboard": "Dashboard",
        "settings": "Settings",
        "credits": "credits",
        "freeTools": "Free Tools →",
        "toggleDark": "Toggle dark mode",
        "loading": "...",
    },
    "es": {
        "home": "Inicio",
        "blog": "Blog",
        "pricing": "Precios",
        "about": "Acerca de",
        "login": "Iniciar sesión",
        "logout": "Cerrar sesión",
        "signup": "Registrarse",
        "dashboard": "Panel",
        "settings": "Configuración",
        "credits": "créditos",
        "freeTools": "Herramientas Gratuitas →",
        "toggleDark": "Modo oscuro",
        "loading": "...",
    },
    "ar": {
        "home": "الرئيسية",
        "blog": "المدونة",
        "pricing": "الأسعار",
        "about": "حول",
        "login": "تسجيل الدخول",
        "logout": "تسجيل الخروج",
        "signup": "إنشاء حساب",
        "dashboard": "لوحة التحكم",
        "settings": "الإعدادات",
        "credits": "أرصدة",
        "freeTools": "أدوات مجانية ←",
        "toggleDark": "الوضع الداكن",
        "loading": "...",
    },
}

# Tool howToUse/FAQ translations — ES
tool_es = {
    "ai-image-generator": {
        "howToUse": [
            "Escribe un prompt detallado describiendo la imagen que deseas — incluye sujeto, estilo, iluminación y composición.",
            "Elige nivel de calidad (Bajo/Medio/Alto), relación de aspecto (1:1, 3:2, 2:3) y formato de salida (PNG, JPEG, WebP).",
            "Opcionalmente sube una imagen de referencia para guiar el estilo de la IA.",
            "Establece el número de imágenes (1-4) — cada imagen adicional suma 1 crédito.",
            "Haz clic en Generar y descarga tus imágenes en el formato elegido.",
        ],
        "faq": [
            {"question": "¿Cómo funciona la generación de imágenes con IA?", "answer": "Nuestra herramienta usa Stability AI SDXL — un modelo de texto a imagen de última generación. Interpreta tu prompt y genera imágenes fotorrealistas o artísticas. Las imágenes de referencia se admiten mediante el modo img2img."},
            {"question": "¿Qué calidad debo elegir?", "answer": "Baja (1 crédito) es más rápida y barata — ideal para borradores. Media (2 créditos) equilibra velocidad y calidad. Alta (3 créditos) usa más pasos de inferencia para máximo detalle."},
            {"question": "¿Cómo escribo un buen prompt?", "answer": "Sé específico y descriptivo. Incluye sujeto, acción, entorno, colores, estilo y ambiente. En lugar de 'un gato', prueba 'un gato naranja esponjoso sentado en el alféizar soleado, luz matutina suave, fotorrealista, detalle 4K'."},
            {"question": "¿Cuántas imágenes puedo generar a la vez?", "answer": "De 1 a 4 imágenes por generación. Cada imagen adicional añade 1 crédito. Generar varias a la vez es más eficiente que ejecutar generaciones separadas."},
            {"question": "¿Cuáles son los créditos y formatos?", "answer": "Costo base: 1 crédito. Calidad: Baja=1, Media=2, Alta=3. Imagen de referencia añade 1. Formatos: PNG (sin pérdida), JPEG (comprimido) o WebP (formato web moderno)."},
        ]
    },
    "avatar-generator": {
        "howToUse": [
            "Sube una foto frontal clara con buena iluminación — evita sombras, sombreros o rostros obstruidos.",
            "Selecciona uno de 6 estilos: 3D Cartoon, Anime, Profesional, Pixel Art, Acuarela o Boceto.",
            "Haz clic en Generar y la IA crea 4 variaciones con prompts SDXL optimizados por estilo.",
            "Descarga las 4 variaciones en alta resolución.",
        ],
        "faq": [
            {"question": "¿Qué foto funciona mejor?", "answer": "Un retrato frontal claro con buena iluminación y fondo neutro. Evita fotos grupales, gafas de sol, sombreros o ángulos extremos."},
            {"question": "¿Qué estilos están disponibles?", "answer": "6 estilos: 3D Cartoon (estilo Pixar), Anime (animación japonesa), Profesional (foto corporativa), Pixel Art (estilo retro), Acuarela (artístico) y Boceto (dibujo a lápiz)."},
            {"question": "¿Cuántas variaciones obtengo?", "answer": "4 variaciones por generación. La IA crea 4 versiones diferentes de la misma foto para que elijas tu favorita."},
            {"question": "¿Cuántos créditos cuesta?", "answer": "5 créditos por generación (incluye las 4 variaciones). Es más alto porque ejecuta múltiples inferencias SDXL con prompts optimizados por estilo."},
        ]
    },
    "background-remover": {
        "howToUse": [
            "Sube una imagen — fotos de productos, retratos y objetos con bordes definidos funcionan mejor.",
            "Elige modo Automático para eliminación con un clic, o Manual para pintar áreas verdes sobre lo que quieres conservar.",
            "Selecciona un color de fondo: transparente, blanco, negro o cualquier color hexadecimal personalizado.",
            "Descarga tu imagen con fondo limpio y transparente en formato PNG.",
        ],
        "faq": [
            {"question": "¿Qué tan precisa es la eliminación de fondo?", "answer": "Usa BRIA RMBG — un modelo de eliminación de fondo de vanguardia. Maneja bien bordes complejos como cabello, pieles y objetos transparentes."},
            {"question": "¿Cuándo usar el modo Manual?", "answer": "Usa el modo Manual cuando el sujeto tiene detalles finos (cabello suelto, encaje) o cuando el modo Auto elimina partes del sujeto. Pinta trazos verdes sobre las áreas a conservar."},
            {"question": "¿Qué fondos de reemplazo puedo elegir?", "answer": "Transparente (PNG con canal alfa), blanco sólido, negro sólido, o cualquier color hexadecimal personalizado. Ideal para comercio electrónico y fotos de perfil."},
            {"question": "¿Qué formatos de imagen se admiten?", "answer": "PNG, JPG y WebP hasta 10MB. La salida siempre es PNG sin pérdida para preservar transparencia y calidad."},
        ]
    },
    "watermark-remover": {
        "howToUse": [
            "Sube una imagen con marcas de agua, logotipos, sellos de fecha o texto superpuesto no deseado.",
            "Usa Detección Automática para que la IA encuentre y elimine marcas de agua, o pinta una máscara roja para control manual.",
            "En modo manual, pinta sobre el área de la marca con el pincel — los trazos aproximados funcionan mejor.",
            "Haz clic en Eliminar y descarga tu imagen limpia.",
        ],
        "faq": [
            {"question": "¿Puede eliminar cualquier marca de agua?", "answer": "La IA funciona mejor con marcas de agua semitransparentes, logotipos y superposiciones de texto. Las marcas grandes y opacas pueden requerir enmascarado manual."},
            {"question": "¿Diferencia entre Detección Automática y Manual?", "answer": "La Detección Automática usa Florence-2 para encontrar marcas automáticamente. El modo Manual te da control total con un pincel para marcas irregulares."},
            {"question": "¿Cómo debo pintar la máscara?", "answer": "Trazos aproximados sobre el área de la marca funcionan mejor. No necesitas bordes perfectos — la IA usa el contexto circundante para rellenar naturalmente."},
            {"question": "¿Cuántos créditos cuesta?", "answer": "3 créditos por imagen. Cubre tanto la detección (Florence-2) como la eliminación (BRIA Eraser)."},
        ]
    },
    "photo-restorer": {
        "howToUse": [
            "Sube una foto antigua, dañada o descolorida.",
            "Elige modo Auto para eliminación general de rayones/polvo, o modo Face Pro (GFPGAN) para mejora facial.",
            "Haz clic en Restaurar — el proceso toma 10-30 segundos.",
            "Descarga tu foto restaurada y compárala con la original.",
        ],
        "faq": [
            {"question": "¿Diferencia entre modo Auto y Face Pro?", "answer": "Auto usa Topaz Dust & Scratch v2 para restauración general. Face Pro añade GFPGAN para restaurar detalles faciales en retratos y fotos grupales."},
            {"question": "¿Puede restaurar fotos muy dañadas?", "answer": "La IA maneja bien daños moderados como rayones, polvo y decoloración. Fotos severamente rasgadas o con daños por agua pueden mostrar mejora limitada."},
            {"question": "¿En qué se diferencia del Colorizador B&N?", "answer": "Photo Restorer repara daños físicos. El Colorizador añade color realista a fotos B&N. Úsalos juntos: restaura primero, colorea después."},
            {"question": "¿Qué formatos se admiten?", "answer": "PNG, JPG y WebP hasta 10MB. La salida es PNG para preservar calidad sin pérdida."},
        ]
    },
    "image-upscaler": {
        "howToUse": [
            "Sube una imagen que quieras ampliar.",
            "Elige modo Foto (fotografías reales) o Anime (ilustraciones, manga) para resultados optimizados.",
            "Selecciona factor de ampliación 2x o 4x.",
            "Descarga tu imagen en alta resolución con detalles mejorados.",
        ],
        "faq": [
            {"question": "¿Cuánto puedo ampliar una imagen?", "answer": "2x o 4x la resolución original. Por ejemplo, 500x500 pasa a 1000x1000 (2x) o 2000x2000 (4x). Real-ESRGAN reconstruye detalles de alta frecuencia."},
            {"question": "¿Diferencia entre modo Foto y Anime?", "answer": "El modo Foto está optimizado para fotografías reales. El modo Anime para ilustraciones y manga. Usar el modo correcto evita artefactos."},
            {"question": "¿Cuándo usar 4x en lugar de 2x?", "answer": "Usa 2x para ampliación moderada. Usa 4x para ampliación significativa (impresión, pantalla 4K). 4x toma un poco más de tiempo."},
            {"question": "¿Es gratis la ampliación?", "answer": "No — 2 créditos por imagen independientemente del factor de escala. El modelo Real-ESRGAN se ejecuta en infraestructura GPU."},
        ]
    },
    "style-transfer": {
        "howToUse": [
            "Sube una foto que quieras transformar — retratos, paisajes y arquitectura funcionan bien.",
            "Selecciona uno de 6 estilos artísticos: Óleo, Acuarela, Boceto, Cartoon, Cyberpunk o Fantasía.",
            "Opcionalmente añade una descripción para afinar la aplicación del estilo.",
            "Haz clic en Generar y espera 10-20 segundos. Descarga tu obra de arte estilizada.",
        ],
        "faq": [
            {"question": "¿Qué estilos están disponibles?", "answer": "6 estilos: Óleo (pinceladas ricas), Acuarela (lavados suaves), Boceto (dibujo a lápiz), Cartoon (estilo animado), Cyberpunk (futurista neón) y Fantasía (mágico)."},
            {"question": "¿En qué se diferencia del Generador de Imágenes IA?", "answer": "Style Transfer transforma una foto existente aplicando un estilo artístico. El Generador crea imágenes completamente nuevas desde texto."},
            {"question": "¿Qué fotos funcionan mejor?", "answer": "Fotos con sujetos claros y buen contraste. Retratos, paisajes y arquitectura con formas definidas funcionan bien."},
            {"question": "¿Puedo usar un estilo personalizado?", "answer": "Actualmente hay 6 estilos predefinidos. El prompt de texto opcional te permite afinar colores, ambiente y detalles dentro del estilo elegido."},
        ]
    },
}

tool_ar = {
    "ai-image-generator": {
        "howToUse": [
            "اكتب وصفًا تفصيليًا للصورة التي تريدها — يشمل الموضوع والأسلوب والإضاءة والتكوين.",
            "اختر مستوى الجودة (منخفض/متوسط/عالي)، نسبة العرض إلى الارتفاع، وتنسيق الإخراج (PNG، JPEG، WebP).",
            "اختياريًا قم بتحميل صورة مرجعية لتوجيه أسلوب الذكاء الاصطناعي.",
            "حدد عدد الصور (1-4) — كل صورة إضافية تضيف رصيدًا واحدًا.",
            "انقر على 'توليد' وقم بتنزيل صورك بالتنسيق المختار.",
        ],
        "faq": [
            {"question": "كيف يعمل توليد الصور بالذكاء الاصطناعي؟", "answer": "تستخدم أداتنا Stability AI SDXL — نموذج تحويل النص إلى صورة المتطور. يفسر وصفك وينشئ صورًا واقعية أو فنية."},
            {"question": "أي جودة يجب أن أختار؟", "answer": "منخفضة (ائتمان واحد) أسرع وأرخص. متوسطة (ائتمانان) توازن بين السرعة والجودة. عالية (3 ائتمانات) تستخدم خطوات استدلال أكثر لأقصى تفاصيل."},
            {"question": "كيف أكتب وصفًا جيدًا؟", "answer": "كن محددًا ووصفيًا. اذكر الموضوع، الإجراء، المكان، الألوان، الأسلوب، والمزاج. بدلاً من 'قطة'، جرب 'قطة برتقالية منفوشة تجلس على حافة النافذة المشمسة، ضوء الصباح الناعم، واقعية، تفاصيل 4K'."},
            {"question": "كم عدد الصور التي يمكنني توليدها؟", "answer": "من 1 إلى 4 صور لكل عملية توليد. كل صورة إضافية تضيف ائتمانًا واحدًا."},
            {"question": "ما هي الأرصدة والتنسيقات؟", "answer": "التكلفة الأساسية: ائتمان واحد. الجودة: منخفضة=1، متوسطة=2، عالية=3. الصورة المرجعية تضيف 1. التنسيقات: PNG أو JPEG أو WebP."},
        ]
    },
    "avatar-generator": {
        "howToUse": [
            "قم بتحميل صورة أمامية واضحة بإضاءة جيدة — تجنب الظلال أو القبعات أو الوجوه المحجوبة.",
            "اختر أحد 6 أنماط: كرتون ثلاثي الأبعاد، أنمي، احترافي، فن البكسل، ألوان مائية، أو رسم تخطيطي.",
            "انقر على 'توليد' وسيقوم الذكاء الاصطناعي بإنشاء 4 تنويعات.",
            "قم بتنزيل جميع التنويعات الأربعة بدقة عالية.",
        ],
        "faq": [
            {"question": "ما الصورة الأفضل للتوليد؟", "answer": "صورة أمامية واضحة بإضاءة جيدة وخلفية محايدة. تجنب الصور الجماعية أو النظارات الشمسية أو القبعات."},
            {"question": "ما الأنماط المتاحة؟", "answer": "6 أنماط: كرتون ثلاثي الأبعاد، أنمي، احترافي، فن البكسل، ألوان مائية، ورسم تخطيطي."},
            {"question": "كم عدد التنويعات التي أحصل عليها؟", "answer": "4 تنويعات لكل عملية توليد. الذكاء الاصطناعي ينشئ 4 إصدارات مختلفة من نفس الصورة لتختار المفضلة."},
            {"question": "كم عدد الأرصدة التي تكلفها؟", "answer": "5 أرصدة لكل عملية توليد (تشمل جميع التنويعات الأربعة)."},
        ]
    },
    "background-remover": {
        "howToUse": [
            "قم بتحميل صورة — صور المنتجات والصور الشخصية والأشياء ذات الحواف الواضحة تعمل بشكل أفضل.",
            "اختر الوضع التلقائي للإزالة بنقرة واحدة، أو الوضع اليدوي لطلاء المناطق التي تريد الاحتفاظ بها باللون الأخضر.",
            "اختر لون خلفية بديل: شفاف، أبيض، أسود، أو أي لون هيكس مخصص.",
            "قم بتنزيل صورتك بخلفية نظيفة وشفافة بصيغة PNG.",
        ],
        "faq": [
            {"question": "ما مدى دقة إزالة الخلفية بالذكاء الاصطناعي؟", "answer": "مدعوم بـ BRIA RMBG — نموذج متطور لإزالة الخلفية. يتعامل مع الحواف المعقدة مثل الشعر والفراء."},
            {"question": "متى يجب استخدام الوضع اليدوي؟", "answer": "استخدم الوضع اليدوي عندما يكون للموضوع تفاصيل دقيقة أو عندما يزيل الوضع التلقائي أجزاء من الموضوع. قم بطلاء خطوط خضراء على مناطق الاحتفاظ."},
            {"question": "ما خلفيات الاستبدال المتاحة؟", "answer": "شفاف، أبيض، أسود، أو أي لون هيكس مخصص. مثالي للتجارة الإلكترونية وصور الملف الشخصي."},
            {"question": "ما تنسيقات الصور المدعومة؟", "answer": "PNG و JPG و WebP حتى 10 ميجابايت. المخرجات دائمًا PNG للحفاظ على الشفافية والجودة."},
        ]
    },
}

# Apply all updates
for lang in ["en", "es", "ar"]:
    path = f"C:/Users/jun/ai-toolbox/src/locales/{lang}/common.json"
    with open(path, encoding="utf-8") as f:
        d = json.load(f)

    # Home keys
    if 'home' not in d:
        d['home'] = {}
    for k, v in home_keys[lang].items():
        d['home'][k] = v

    # Footer keys
    if 'footer' not in d:
        d['footer'] = {}
    for k, v in footer_keys[lang].items():
        d['footer'][k] = v

    # Nav keys
    if 'nav' not in d:
        d['nav'] = {}
    for k, v in nav_keys[lang].items():
        d['nav'][k] = v

    # Tool keys
    if 'tools' not in d:
        d['tools'] = {}

    # Copy English tool data for all tools
    for tid, tdata in tool_data.items():
        if tid not in d['tools']:
            d['tools'][tid] = {}

        if lang == 'en':
            d['tools'][tid]['howToUse'] = tdata['howToUse']
            d['tools'][tid]['faq'] = tdata['faq']
        elif lang == 'es' and tid in tool_es:
            d['tools'][tid]['howToUse'] = tool_es[tid]['howToUse']
            d['tools'][tid]['faq'] = tool_es[tid]['faq']
        elif lang == 'ar' and tid in tool_ar:
            d['tools'][tid]['howToUse'] = tool_ar[tid]['howToUse']
            d['tools'][tid]['faq'] = tool_ar[tid]['faq']
        # else: keep existing or leave empty (will fallback to tools.ts)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(d, f, indent="\t", ensure_ascii=False)
        f.write("\n")
    print(f"{lang}: OK — home({len(home_keys[lang])}) + footer({len(footer_keys[lang])}) + nav({len(nav_keys[lang])}) + {len(tool_data)} tools")

# Verify
print("\n=== Verification ===")
en = json.load(open("C:/Users/jun/ai-toolbox/src/locales/en/common.json", encoding="utf-8"))
for lang in ["es", "ar"]:
    d = json.load(open(f"C:/Users/jun/ai-toolbox/src/locales/{lang}/common.json", encoding="utf-8"))
    missing = []
    for k in en:
        if k not in d:
            missing.append(k)
        elif isinstance(en[k], dict) and isinstance(d[k], dict):
            for sk in en[k]:
                if sk not in d[k]:
                    missing.append(f"{k}.{sk}")
    if missing:
        print(f"{lang} missing {len(missing)}: {missing[:10]}...")
    else:
        print(f"{lang}: ALL COVERED")
