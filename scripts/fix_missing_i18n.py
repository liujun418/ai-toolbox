"""Add missing ES and AR translations to locale files."""
import json

TRANSLATIONS = {
    "es": {
        "pricing": {
            "oneTimeTitle": "Paquetes de Créditos Únicos",
            "oneTimeDesc": "Compra créditos válidos por 12 meses. Úsalos en cualquier herramienta, cuando quieras.",
            "subscriptionTitle": "Suscripciones Mensuales",
            "subscriptionDesc": "Recibe créditos nuevos cada mes, limitados al máximo de tu plan.",
            "perCredit": "crédito",
            "perMonth": "mes",
            "hardCap": "créditos/mes (límite fijo)",
            "noRollover": "Los créditos no usados no se acumulan",
            "cancelAnytime": "Cancela cuando quieras",
            "valid12Months": "Válido por 12 meses",
            "whyPayg": "¿Por qué Pago por Uso?",
            "whyPayg1": "Sin suscripción mensual obligatoria. Compra créditos solo cuando los necesites.",
            "whyPayg2": "Los créditos comprados son válidos por 12 meses — sin prisa para usarlos.",
            "whyPayg3": "Cada crédito vale lo mismo en todas las herramientas. Transparencia total de precios.",
            "costFootnote": "Basado en Paquete Estándar ($10/50 créditos = $0.20/crédito). Herramientas gratuitas requieren inicio de sesión.",
            "importantInfo": "Información Importante",
            "whatAreCredits": "¿Qué son los Créditos?",
            "whatAreCreditsDesc": "Los créditos son una moneda virtual para acceder a nuestras herramientas IA. Cada uso descuenta un número fijo de créditos. Los costos se muestran antes de cada uso.",
            "expiration": "Vencimiento de Créditos",
            "expirationDesc": "Los créditos comprados son válidos por 12 meses. Los créditos de suscripción se renuevan mensualmente y no se acumulan.",
            "refund": "Política de Reembolso",
            "refundDesc": "Los créditos no son reembolsables una vez comprados. Si experimentas un problema técnico, contáctanos para investigarlo.",
        },
        "privacy": {
            "sections": [
                {"title": "Información que Recopilamos", "content": "Recopilamos la dirección de correo electrónico y los datos de uso (herramientas utilizadas, créditos consumidos). No recopilamos contraseñas en texto plano."},
                {"title": "Cómo Usamos tu Información", "content": "Usamos tu correo electrónico para la gestión de la cuenta y notificaciones del servicio. Los datos de uso nos ayudan a mejorar nuestras herramientas y la precisión de los precios."},
                {"title": "Almacenamiento de Datos", "content": "Tus archivos subidos se almacenan temporalmente en Cloudflare R2 y se eliminan automáticamente. Los datos de la cuenta se almacenan en PostgreSQL en Railway."},
                {"title": "Cookies", "content": "Usamos cookies esenciales para la autenticación. Sin cookies de terceros ni cookies de rastreo."},
                {"title": "Servicios de Terceros", "content": "Usamos Stripe para pagos, Replicate para inferencia de IA, Google Cloud Vision para OCR y Resend para correos electrónicos. Cada servicio procesa datos según sus propias políticas de privacidad."},
                {"title": "Seguridad de Datos", "content": "Las contraseñas se hashean con bcrypt. Toda la comunicación se realiza a través de HTTPS. Los tokens JWT se utilizan para la autenticación de sesión."},
                {"title": "Tus Derechos", "content": "Puedes solicitar la eliminación de datos contactándonos. Eliminaremos los datos de tu cuenta en un plazo de 30 días."},
                {"title": "Política de Retención de Datos", "content": "Los archivos subidos se eliminan después del procesamiento. Los datos de la cuenta se conservan hasta que solicites la eliminación. Los registros de transacciones se conservan indefinidamente por razones legales."},
                {"title": "Privacidad Infantil", "content": "Nuestros servicios no están dirigidos a niños menores de 13 años. No recopilamos intencionadamente información de niños."},
                {"title": "Cambios en esta Política", "content": "Podemos actualizar esta política periódicamente. Los cambios se publicarán en esta página con una fecha de revisión actualizada."},
                {"title": "Contáctanos", "content": "Para preguntas relacionadas con la privacidad, envíanos un correo a jzerov@live.com."},
            ]
        },
        "terms": {
            "sections": [
                {"title": "Aceptación de los Términos", "content": "Al usar AI ToolBox Online, aceptas estos Términos de Servicio. Si no estás de acuerdo, no uses nuestros servicios."},
                {"title": "Descripción del Servicio", "content": "AI ToolBox Online proporciona herramientas impulsadas por IA para procesamiento de imágenes, creación de contenido y conversión de documentos."},
                {"title": "Cuentas de Usuario", "content": "Eres responsable de mantener la confidencialidad de tu cuenta. Debes proporcionar información precisa durante el registro."},
                {"title": "Sistema de Créditos", "content": "Los créditos son moneda virtual para acceder a herramientas de IA. Cada uso de herramienta consume créditos a las tarifas publicadas. Los créditos no tienen valor monetario fuera de nuestra plataforma."},
                {"title": "Pagos", "content": "Todos los pagos se procesan a través de Stripe. Los precios se muestran en dólares estadounidenses. Los créditos comprados son válidos por 12 meses."},
                {"title": "Propiedad del Contenido", "content": "Eres propietario de todo el contenido que generes utilizando nuestras herramientas. No reclamamos la propiedad de tus entradas o salidas."},
                {"title": "Uso Aceptable", "content": "No puedes usar nuestras herramientas para crear contenido ilegal, dañino o abusivo. Nos reservamos el derecho de suspender cuentas que violen estos términos."},
                {"title": "Limitación de Responsabilidad", "content": "AI ToolBox Online se proporciona \"tal cual\". No garantizamos disponibilidad ininterrumpida ni resultados perfectos."},
                {"title": "Cancelación", "content": "Puedes cancelar tu cuenta en cualquier momento. Las suscripciones se pueden cancelar mensualmente."},
                {"title": "Cambios en los Términos", "content": "Podemos actualizar estos términos periódicamente. El uso continuado después de los cambios constituye la aceptación de los nuevos términos."},
                {"title": "Ley Aplicable", "content": "Estos términos se rigen por las leyes aplicables. Las disputas se resolverán mediante arbitraje vinculante."},
                {"title": "Propiedad Intelectual", "content": "La plataforma AI ToolBox Online, su código y diseño están protegidos por derechos de autor y otras leyes de propiedad intelectual."},
                {"title": "Contáctanos", "content": "Para preguntas legales, contáctanos en jzerov@live.com."},
            ]
        }
    },
    "ar": {
        "pricing": {
            "oneTimeTitle": "حزم الشراء لمرة واحدة",
            "oneTimeDesc": "اشترِ أرصدة صالحة لمدة 12 شهرًا. استخدمها على أي أداة، في أي وقت.",
            "subscriptionTitle": "الاشتراكات الشهرية",
            "subscriptionDesc": "احصل على أرصدة جديدة كل شهر، بحد أقصى حسب خطتك.",
            "perCredit": "رصيد",
            "perMonth": "شهر",
            "hardCap": "رصيد/شهر (حد أقصى)",
            "noRollover": "الأرصدة غير المستخدمة لا تترحل",
            "cancelAnytime": "إلغاء في أي وقت",
            "valid12Months": "صالحة لمدة 12 شهرًا",
            "whyPayg": "لماذا الدفع حسب الاستخدام؟",
            "whyPayg1": "لا التزام باشتراك شهري. اشترِ الأرصدة فقط عندما تحتاجها.",
            "whyPayg2": "الأرصدة المشتراة صالحة لمدة 12 شهرًا — لا داعي للاستعجال في استخدامها.",
            "whyPayg3": "كل رصيد له نفس القيمة عبر جميع الأدوات. شفافية كاملة في الأسعار.",
            "costFootnote": "بناءً على الحزمة القياسية ($10/50 رصيد = $0.20/رصيد). الأدوات المجانية تتطلب تسجيل الدخول.",
            "importantInfo": "معلومات هامة",
            "whatAreCredits": "ما هي الأرصدة؟",
            "whatAreCreditsDesc": "الأرصدة هي عملة افتراضية تستخدم للوصول إلى أدوات الذكاء الاصطناعي لدينا. كل استخدام لأداة يخصم عددًا محددًا من الأرصدة. تظهر التكاليف قبل كل استخدام.",
            "expiration": "انتهاء صلاحية الأرصدة",
            "expirationDesc": "الأرصدة المشتراة صالحة لمدة 12 شهرًا. تتجدد أرصدة الاشتراك شهريًا ولا تترحل.",
            "refund": "سياسة الاسترداد",
            "refundDesc": "الأرصدة غير قابلة للاسترداد بعد الشراء. إذا واجهت مشكلة تقنية، اتصل بنا للتحقيق.",
        },
        "privacy": {
            "sections": [
                {"title": "المعلومات التي نجمعها", "content": "نجمع عنوان البريد الإلكتروني وبيانات الاستخدام (الأدوات المستخدمة، الأرصدة المستهلكة). لا نجمع كلمات المرور بنص صريح."},
                {"title": "كيف نستخدم معلوماتك", "content": "نستخدم بريدك الإلكتروني لإدارة الحساب وإشعارات الخدمة. تساعدنا بيانات الاستخدام على تحسين أدواتنا ودقة التسعير."},
                {"title": "تخزين البيانات", "content": "يتم تخزين ملفاتك المرفوعة مؤقتًا في Cloudflare R2 وتُحذف تلقائيًا. تُخزن بيانات الحساب في PostgreSQL على Railway."},
                {"title": "ملفات تعريف الارتباط", "content": "نستخدم ملفات تعريف ارتباط أساسية للمصادقة. لا توجد ملفات تعريف ارتباط تابعة لجهات خارجية أو ملفات تتبع."},
                {"title": "خدمات الطرف الثالث", "content": "نستخدم Stripe للمدفوعات، وReplicate لاستدلال الذكاء الاصطناعي، وGoogle Cloud Vision للتعرف الضوئي على الحروف، وResend للبريد الإلكتروني. تعالج كل خدمة البيانات وفقًا لسياسات الخصوصية الخاصة بها."},
                {"title": "أمن البيانات", "content": "تُجزأ كلمات المرور باستخدام bcrypt. جميع الاتصالات عبر HTTPS. تُستخدم رموز JWT لمصادقة الجلسة."},
                {"title": "حقوقك", "content": "يمكنك طلب حذف البيانات بالاتصال بنا. سنحذف بيانات حسابك في غضون 30 يومًا."},
                {"title": "سياسة الاحتفاظ بالبيانات", "content": "تُحذف الملفات المرفوعة بعد المعالجة. تُحتفظ ببيانات الحساب حتى تطلب الحذف. تُحتفظ بسجلات المعاملات إلى أجل غير مسمى لأسباب قانونية."},
                {"title": "خصوصية الأطفال", "content": "خدماتنا ليست موجهة للأطفال دون سن 13 عامًا. لا نجمع معلومات من الأطفال عن قصد."},
                {"title": "التغييرات على هذه السياسة", "content": "قد نحدث هذه السياسة دوريًا. ستنشر التغييرات على هذه الصفحة مع تاريخ مراجعة محدث."},
                {"title": "اتصل بنا", "content": "للأسئلة المتعلقة بالخصوصية، راسلنا على jzerov@live.com."},
            ]
        },
        "terms": {
            "sections": [
                {"title": "قبول الشروط", "content": "باستخدام AI ToolBox Online، فإنك توافق على شروط الخدمة هذه. إذا كنت لا توافق، فلا تستخدم خدماتنا."},
                {"title": "وصف الخدمة", "content": "يوفر AI ToolBox Online أدوات مدعومة بالذكاء الاصطناعي لمعالجة الصور وإنشاء المحتوى وتحويل المستندات."},
                {"title": "حسابات المستخدمين", "content": "أنت مسؤول عن الحفاظ على سرية حسابك. يجب عليك تقديم معلومات دقيقة أثناء التسجيل."},
                {"title": "نظام الأرصدة", "content": "الأرصدة هي عملة افتراضية للوصول إلى أدوات الذكاء الاصطناعي. كل استخدام لأداة يستهلك أرصدة بالمعدلات المنشورة. الأرصدة ليس لها قيمة نقدية خارج منصتنا."},
                {"title": "المدفوعات", "content": "تتم معالجة جميع المدفوعات عبر Stripe. الأسعار معروضة بالدولار الأمريكي. الأرصدة المشتراة صالحة لمدة 12 شهرًا."},
                {"title": "ملكية المحتوى", "content": "أنت تملك جميع المحتوى الذي تنشئه باستخدام أدواتنا. لا ندعي ملكية مدخلاتك أو مخرجاتك."},
                {"title": "الاستخدام المقبول", "content": "لا يجوز لك استخدام أدواتنا لإنشاء محتوى غير قانوني أو ضار أو مسيء. نحتفظ بالحق في تعليق الحسابات التي تنتهك هذه الشروط."},
                {"title": "تحديد المسؤولية", "content": "يتم توفير AI ToolBox Online \"كما هو\". لا نضمن توفرًا غير منقطع أو نتائج مثالية."},
                {"title": "الإلغاء", "content": "يمكنك إلغاء حسابك في أي وقت. يمكن إلغاء الاشتراكات شهريًا."},
                {"title": "التغييرات على الشروط", "content": "قد نحدث هذه الشروط دوريًا. استمرار الاستخدام بعد التغييرات يشكل قبولًا للشروط الجديدة."},
                {"title": "القانون الحاكم", "content": "تخضع هذه الشروط للقوانين المعمول بها. سيتم حل النزاعات من خلال التحكيم الملزم."},
                {"title": "الملكية الفكرية", "content": "منصة AI ToolBox Online ورمزها وتصميمها محمية بموجب حقوق النشر وقوانين الملكية الفكرية الأخرى."},
                {"title": "اتصل بنا", "content": "للأسئلة القانونية، اتصل بنا على jzerov@live.com."},
            ]
        }
    }
}

for lang, data in TRANSLATIONS.items():
    path = f"C:/Users/jun/ai-toolbox/src/locales/{lang}/common.json"
    with open(path, encoding="utf-8") as f:
        d = json.load(f)

    for section, entries in data.items():
        if section not in d:
            d[section] = {}
        for key, val in entries.items():
            d[section][key] = val

    with open(path, "w", encoding="utf-8") as f:
        json.dump(d, f, indent="\t", ensure_ascii=False)
        f.write("\n")
    print(f"{lang}: OK")

# Re-check
print("\n=== Re-checking ===")
en = json.load(open("C:/Users/jun/ai-toolbox/src/locales/en/common.json", encoding="utf-8"))
for lang, label in [("es", "ES"), ("ar", "AR")]:
    path = f"C:/Users/jun/ai-toolbox/src/locales/{lang}/common.json"
    tg = json.load(open(path, encoding="utf-8"))
    missing = []
    for k in en:
        if k not in tg:
            missing.append(k)
        elif isinstance(en[k], dict) and isinstance(tg[k], dict):
            for sk in en[k]:
                if sk not in tg[k]:
                    missing.append(f"{k}.{sk}")
                elif isinstance(en[k][sk], list) and isinstance(tg[k][sk], list):
                    if len(en[k][sk]) != len(tg[k][sk]):
                        missing.append(f"{k}.{sk} (len: {len(en[k][sk])} vs {len(tg[k][sk])})")
    if missing:
        print(f"{label} still missing: {len(missing)}")
        for m in missing[:5]:
            print(f"  {m}")
    else:
        print(f"{label}: ALL COVERED")
