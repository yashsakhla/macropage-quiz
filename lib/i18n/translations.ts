export type Lang = "en" | "hi" | "hinglish";

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हि" },
  { code: "hinglish", label: "Hinglish" },
];

export const translations = {
  landing: {
    badge: {
      en: "Live business quiz",
      hi: "लाइव बिज़नेस क्विज़",
      hinglish: "Live business quiz",
    },
    headline: {
      en: "How tech-ready is your business?",
      hi: "आपका बिज़नेस टेक-रेडी कितना है?",
      hinglish: "Aapka business tech-ready kitna hai?",
    },
    subhead: {
      en: "Answer live with the room, climb the leaderboard, and get a free AI read on your business.",
      hi: "सबके साथ लाइव जवाब दें, लीडरबोर्ड में ऊपर जाएं, और अपने बिज़नेस पर मुफ़्त AI रिपोर्ट पाएं।",
      hinglish: "Sabke saath live answer do, leaderboard mein upar jao, aur business ka free AI report pao.",
    },
    sessionLive: {
      en: "Session is live",
      hi: "सेशन लाइव है",
      hinglish: "Session live hai",
    },
    enterButton: {
      en: "Join the session",
      hi: "सेशन में शामिल हों",
      hinglish: "Session join karo",
    },
    noSession: {
      en: "No live session right now",
      hi: "अभी कोई लाइव सेशन नहीं है",
      hinglish: "Abhi koi live session nahi hai",
    },
    noSessionHint: {
      en: "Scan the QR code on screen to join a session.",
      hi: "सेशन में शामिल होने के लिए स्क्रीन पर दिखाया गया QR कोड स्कैन करें।",
      hinglish: "Session join karne ke liye screen wala QR code scan karo.",
    },
  },
  join: {
    badge: {
      en: "You're one scan away",
      hi: "बस एक स्कैन दूर",
      hinglish: "Bas ek scan door",
    },
    headline: {
      en: "Let's find out how tech-ready your business is",
      hi: "चलिए जानते हैं आपका बिज़नेस टेक-रेडी कितना है",
      hinglish: "Chalo pata karte hain aapka business tech-ready kitna hai",
    },
    subhead: {
      en: "Takes 2 minutes. Answer live, see your score, get a free AI read on your business.",
      hi: "सिर्फ़ 2 मिनट लगेंगे। लाइव जवाब दें, अपना स्कोर देखें, बिज़नेस पर मुफ़्त AI रिपोर्ट पाएं।",
      hinglish: "Sirf 2 minute lagenge. Live answer do, apna score dekho, business ka free AI report pao.",
    },
    nameLabel: { en: "Your name", hi: "आपका नाम", hinglish: "Aapka naam" },
    namePlaceholder: {
      en: "e.g. Priya Sharma",
      hi: "जैसे प्रिया शर्मा",
      hinglish: "jaise Priya Sharma",
    },
    whatsappLabel: { en: "WhatsApp number", hi: "व्हाट्सएप नंबर", hinglish: "WhatsApp number" },
    whatsappPlaceholder: {
      en: "e.g. 98765 43210",
      hi: "जैसे 98765 43210",
      hinglish: "jaise 98765 43210",
    },
    missingSession: {
      en: "Missing session — please rescan the QR code shown on screen.",
      hi: "सेशन नहीं मिला — कृपया स्क्रीन पर दिखाया गया QR कोड दोबारा स्कैन करें।",
      hinglish: "Session nahi mila — please screen wala QR code dobara scan karo.",
    },
    genericError: {
      en: "Something went wrong. Try again.",
      hi: "कुछ गड़बड़ हो गई। दोबारा कोशिश करें।",
      hinglish: "Kuch gadbad ho gayi. Dobara try karo.",
    },
    submit: { en: "Join the quiz", hi: "क्विज़ में शामिल हों", hinglish: "Quiz join karo" },
    submitting: { en: "Joining…", hi: "जुड़ रहे हैं…", hinglish: "Join ho rahe hain…" },
    tryDemo: { en: "Try the demo quiz", hi: "डेमो क्विज़ आज़माएं", hinglish: "Demo quiz try karo" },
  },
  onboarding: {
    headline: {
      en: "Tell us about your business",
      hi: "अपने बिज़नेस के बारे में बताएं",
      hinglish: "Apne business ke baare mein batao",
    },
    businessNameLabel: { en: "Business name", hi: "बिज़नेस का नाम", hinglish: "Business ka naam" },
    businessNamePlaceholder: {
      en: "e.g. Sharma Sweets",
      hi: "जैसे शर्मा स्वीट्स",
      hinglish: "jaise Sharma Sweets",
    },
    categoryLabel: { en: "Business category", hi: "बिज़नेस श्रेणी", hinglish: "Business category" },
    categoryPlaceholder: {
      en: "Select a category",
      hi: "श्रेणी चुनें",
      hinglish: "Category chuno",
    },
    goalLabel: { en: "Your #1 goal", hi: "आपका #1 लक्ष्य", hinglish: "Aapka #1 goal" },
    goalOther: {
      en: "What's your goal?",
      hi: "आपका लक्ष्य क्या है?",
      hinglish: "Aapka goal kya hai?",
    },
    continue: { en: "Continue", hi: "आगे बढ़ें", hinglish: "Continue karo" },
    saving: { en: "Saving…", hi: "सेव हो रहा है…", hinglish: "Save ho raha hai…" },
    genericError: {
      en: "Something went wrong. Try again.",
      hi: "कुछ गड़बड़ हो गई। दोबारा कोशिश करें।",
      hinglish: "Kuch gadbad ho gayi. Dobara try karo.",
    },
    goals: {
      "Grow customer base": {
        en: "Grow customer base",
        hi: "ग्राहक बढ़ाना",
        hinglish: "Customer base grow karna",
      },
      "Grow revenue": {
        en: "Grow revenue",
        hi: "आमदनी बढ़ाना",
        hinglish: "Revenue grow karna",
      },
      Other: { en: "Other", hi: "अन्य", hinglish: "Kuch aur" },
    },
  },
  waiting: {
    title: { en: "You're in!", hi: "आप शामिल हो गए!", hinglish: "Aap in ho gaye!" },
    subhead: {
      en: "Waiting for the host to start the quiz… keep your phone open.",
      hi: "होस्ट के क्विज़ शुरू करने का इंतज़ार है… फ़ोन खुला रखें।",
      hinglish: "Host ke quiz start karne ka wait hai… phone khula rakho.",
    },
  },
  quiz: {
    questionLabel: { en: "Question", hi: "प्रश्न", hinglish: "Question" },
    loading: { en: "Loading question…", hi: "प्रश्न लोड हो रहा है…", hinglish: "Question load ho raha hai…" },
    locked: { en: "Answer locked in ✓", hi: "जवाब लॉक हो गया ✓", hinglish: "Answer lock ho gaya ✓" },
    timesUp: {
      en: "Time's up — next question coming",
      hi: "समय समाप्त — अगला प्रश्न आ रहा है",
      hinglish: "Time up — agla question aa raha hai",
    },
    doneTitle: { en: "You're done!", hi: "आपका क्विज़ पूरा हुआ!", hinglish: "Aapka quiz done ho gaya!" },
    doneSubhead: {
      en: "Waiting for others to finish… results are coming up soon.",
      hi: "बाकी लोगों के पूरा करने का इंतज़ार है… नतीजे जल्द आएंगे।",
      hinglish: "Baaki logon ke finish karne ka wait hai… results jald aayenge.",
    },
  },
  results: {
    complete: { en: "Quiz complete", hi: "क्विज़ पूरा हुआ", hinglish: "Quiz complete" },
    calculating: { en: "Calculating your rank…", hi: "आपकी रैंक निकाली जा रही है…", hinglish: "Rank calculate ho rahi hai…" },
    finishedPrefix: { en: "You finished", hi: "आपने", hinglish: "Aap" },
    finishedSuffix: { en: "of", hi: "में से रैंक पाई", hinglish: "mein se rank paayi" },
    ctaLead: {
      en: "Now let's see what your answers say about your business's tech readiness.",
      hi: "अब देखते हैं आपके जवाब आपके बिज़नेस की टेक-रेडीनेस के बारे में क्या कहते हैं।",
      hinglish: "Ab dekhte hain aapke answers business ki tech-readiness ke baare mein kya kehte hain.",
    },
    analyzeButton: {
      en: "Analyze My Business",
      hi: "मेरा बिज़नेस विश्लेषण करें",
      hinglish: "Mera Business Analyze Karo",
    },
  },
  analysis: {
    reportLabel: { en: "Your report", hi: "आपकी रिपोर्ट", hinglish: "Aapki report" },
    archetypeLabel: { en: "Your archetype", hi: "आपका आर्किटाइप", hinglish: "Aapka archetype" },
    snapshotLabel: { en: "Business snapshot", hi: "बिज़नेस स्नैपशॉट", hinglish: "Business snapshot" },
    mindsetLabel: { en: "Mindset profile", hi: "माइंडसेट प्रोफ़ाइल", hinglish: "Mindset profile" },
    roadmapLabel: { en: "Your goal roadmap", hi: "आपका लक्ष्य रोडमैप", hinglish: "Aapka goal roadmap" },
    recommendationLabel: {
      en: "Our recommendation",
      hi: "हमारी सिफ़ारिश",
      hinglish: "Hamari recommendation",
    },
    ctaText: {
      en: "Want this kind of thinking applied to your business?",
      hi: "क्या आप यह सोच अपने बिज़नेस पर लागू करवाना चाहते हैं?",
      hinglish: "Yeh soch apne business pe apply karwana chahte ho?",
    },
    techScoreLabel: { en: "tech score", hi: "टेक स्कोर", hinglish: "tech score" },
    automateButton: {
      en: "Automate Your Business",
      hi: "अपना बिज़नेस ऑटोमेट करें",
      hinglish: "Apna Business Automate Karo",
    },
  },
  aiThinking: {
    lines: {
      en: [
        "Reading your answers…",
        "Comparing against your goal…",
        "Scoring your tech readiness…",
        "Writing your report…",
      ],
      hi: [
        "आपके जवाब पढ़े जा रहे हैं…",
        "आपके लक्ष्य से तुलना हो रही है…",
        "टेक-रेडीनेस स्कोर हो रही है…",
        "रिपोर्ट लिखी जा रही है…",
      ],
      hinglish: [
        "Aapke answers padhe ja rahe hain…",
        "Goal se compare ho raha hai…",
        "Tech-readiness score ho raha hai…",
        "Report likhi ja rahi hai…",
      ],
    },
    modelTag: { en: "MACROPAGE-AI · v2", hi: "MACROPAGE-AI · v2", hinglish: "MACROPAGE-AI · v2" },
  },
  language: {
    label: { en: "Language", hi: "भाषा", hinglish: "Bhasha" },
  },
} as const;

type Translations = typeof translations;

export function t<Section extends keyof Translations, Key extends keyof Translations[Section]>(
  lang: Lang,
  section: Section,
  key: Key
): Translations[Section][Key] extends Record<Lang, infer V> ? V : never {
  const entry = translations[section][key] as unknown as Record<Lang, unknown>;
  return (entry[lang] ?? entry.en) as never;
}
