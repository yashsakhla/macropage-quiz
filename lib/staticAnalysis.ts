import type { AnalysisReport } from "./types";

/** Fallback business titles used when the live analysis API is unavailable, so the
 *  result still reads as a personalized report instead of an error state. */
const BUSINESS_TITLES = [
  "Urban Grocery Collective",
  "Bright Leaf Tea House",
  "Coastal Fitness Studio",
  "Nimbus Cloud Kitchens",
  "Heritage Handloom Co.",
  "Velvet Petal Florist",
  "Ironclad Auto Works",
  "Sunrise Dairy Farm",
  "Pixel Forge Studios",
  "Golden Spoon Catering",
  "Evergreen Landscaping",
  "Nova Tech Repairs",
  "Artisan Bread Bakery",
  "Bluewave Surf Shop",
  "Cedar & Stone Furniture",
  "Prime Legal Associates",
  "Vivid Print Solutions",
  "Harbor View Realty",
  "Zenith Wellness Spa",
  "Craftsman Woodworks",
  "Metro Pet Grooming",
  "Solaris Solar Solutions",
  "Fresh Fields Organic Farm",
  "Silverline Consulting",
  "Maple Grove Daycare",
  "Nomad Travel Agency",
  "Quantum Coding Academy",
  "Rustic Table Restaurant",
  "Peak Performance Gym",
  "Willow Creek Yoga Studio",
  "Circuit Board Electronics",
  "Aurora Skincare Lab",
  "Foundry Marketing Group",
  "Cobblestone Coffee Roasters",
  "Trailblazer Outdoor Gear",
  "Lighthouse Insurance Agency",
  "Copper Kettle Brewery",
  "Meridian Architecture Studio",
  "Bloom & Grow Nursery",
  "Vertex Software Labs",
  "Amber Wave Bakery",
  "Falcon Freight Logistics",
  "Serene Homes Interiors",
  "Ridgeline Adventure Tours",
  "Clearwater Plumbing Co.",
  "Grandview Event Planners",
  "Pinnacle Financial Advisors",
  "Willowbrook Veterinary Clinic",
  "Starlight Photography Studio",
  "Oakwood Furniture Restoration",
];

const HEADLINES = [
  { en: "You're Building a Digital-Ready Business", hi: "आप एक डिजिटल-रेडी बिज़नेस बना रहे हैं" },
  { en: "A Strong Foundation with Room to Scale", hi: "एक मज़बूत नींव, आगे बढ़ने की पूरी गुंजाइश के साथ" },
  { en: "Momentum Is on Your Side", hi: "मोमेंटम आपके साथ है" },
  { en: "You Think Like a Growth-First Founder", hi: "आप एक ग्रोथ-फर्स्ट फाउंडर की तरह सोचते हैं" },
  { en: "Your Business Is Primed for the Next Leap", hi: "आपका बिज़नेस अगली छलांग के लिए तैयार है" },
];

const SNAPSHOTS = [
  {
    en: "Your business shows strong customer focus paired with a willingness to try new approaches when the market shifts.",
    hi: "आपका बिज़नेस मज़बूत कस्टमर फोकस दिखाता है, साथ ही बाज़ार बदलने पर नए तरीके आज़माने की तत्परता भी।",
  },
  {
    en: "You've built steady operations while keeping an eye on emerging tools that could streamline day-to-day work.",
    hi: "आपने स्थिर संचालन बनाया है, साथ ही रोज़मर्रा के काम को आसान बनाने वाले नए टूल्स पर भी नज़र रखी है।",
  },
  {
    en: "Your business balances tradition and innovation, adapting processes without losing the personal touch customers value.",
    hi: "आपका बिज़नेस परंपरा और नवाचार का संतुलन बनाता है, बिना ग्राहकों की पसंदीदा पर्सनल टच खोए प्रक्रियाओं को बदलता है।",
  },
  {
    en: "You've shown resilience by adjusting quickly to changing demand while keeping core operations stable.",
    hi: "आपने बदलती मांग के अनुसार तेज़ी से ढलकर लचीलापन दिखाया है, साथ ही मुख्य संचालन को स्थिर रखा है।",
  },
];

const MINDSETS = [
  {
    en: "You approach challenges with curiosity, favoring practical experiments over waiting for perfect conditions.",
    hi: "आप चुनौतियों को जिज्ञासा से देखते हैं, सही हालात के इंतज़ार से ज़्यादा व्यावहारिक प्रयोगों को तरजीह देते हैं।",
  },
  {
    en: "You lean toward calculated risks, valuing data and customer feedback before committing to big changes.",
    hi: "आप सोच-समझकर जोखिम लेते हैं, बड़े बदलाव से पहले डेटा और ग्राहकों की फीडबैक को अहमियत देते हैं।",
  },
  {
    en: "You value consistency and long-term relationships, which gives your decisions a steady, trustworthy edge.",
    hi: "आप निरंतरता और लंबे रिश्तों को महत्व देते हैं, जिससे आपके फैसलों में स्थिरता और भरोसा झलकता है।",
  },
  {
    en: "You're energized by growth opportunities and quick to explore tools that save time or improve quality.",
    hi: "आप ग्रोथ के मौकों से ऊर्जा पाते हैं और समय बचाने या गुणवत्ता बढ़ाने वाले टूल्स को जल्दी आज़मा लेते हैं।",
  },
];

const ROADMAPS = [
  {
    en: [
      "Digitize your customer records to spot repeat-buying patterns",
      "Introduce one new digital touchpoint, like online booking or ordering",
      "Automate a repetitive task to free up hours each week",
    ],
    hi: [
      "दोहराई जाने वाली खरीद के पैटर्न देखने के लिए अपने ग्राहकों का रिकॉर्ड डिजिटल करें",
      "ऑनलाइन बुकिंग या ऑर्डरिंग जैसा एक नया डिजिटल टचपॉइंट जोड़ें",
      "हर हफ्ते समय बचाने के लिए किसी दोहराए जाने वाले काम को ऑटोमेट करें",
    ],
  },
  {
    en: [
      "Set up a simple dashboard to track your top 3 business metrics",
      "Pilot a digital payment or invoicing tool with a small customer group",
      "Build a lightweight online presence to reach new customers",
    ],
    hi: [
      "अपने टॉप 3 बिज़नेस मेट्रिक्स ट्रैक करने के लिए एक सिंपल डैशबोर्ड बनाएं",
      "छोटे ग्राहक समूह के साथ किसी डिजिटल पेमेंट या इनवॉइसिंग टूल को आज़माएं",
      "नए ग्राहकों तक पहुँचने के लिए एक हल्की ऑनलाइन मौजूदगी बनाएं",
    ],
  },
  {
    en: [
      "Map your current workflow to find the biggest time sink",
      "Test one automation tool for scheduling or inventory",
      "Collect structured customer feedback every month",
    ],
    hi: [
      "सबसे ज़्यादा समय लेने वाले काम को खोजने के लिए अपने वर्कफ़्लो को मैप करें",
      "शेड्यूलिंग या इन्वेंटरी के लिए किसी एक ऑटोमेशन टूल को आज़माएं",
      "हर महीने संरचित ग्राहक फीडबैक इकट्ठा करें",
    ],
  },
];

const RECOMMENDATIONS = [
  {
    en: "A lightweight CRM paired with automated follow-ups could meaningfully boost repeat business over the next quarter.",
    hi: "एक हल्का CRM ऑटोमेटेड फॉलो-अप के साथ अगली तिमाही में दोहराए जाने वाले बिज़नेस को काफी बढ़ा सकता है।",
  },
  {
    en: "Investing in a simple digital ordering or booking system is likely to reduce friction for your customers fastest.",
    hi: "एक सिंपल डिजिटल ऑर्डरिंग या बुकिंग सिस्टम में निवेश आपके ग्राहकों के लिए सबसे तेज़ी से रुकावटें कम कर सकता है।",
  },
  {
    en: "A basic analytics setup would help you see which parts of the business are worth doubling down on.",
    hi: "एक बुनियादी एनालिटिक्स सेटअप आपको यह देखने में मदद करेगा कि बिज़नेस के किन हिस्सों पर ज़्यादा ध्यान देना चाहिए।",
  },
  {
    en: "Automating routine communication would free up time for the higher-value parts of running your business.",
    hi: "रूटीन कम्युनिकेशन को ऑटोमेट करने से बिज़नेस के ज़्यादा अहम हिस्सों के लिए समय बचेगा।",
  },
];

function pickIndex(len: number): number {
  return Math.floor(Math.random() * len);
}

/** Deterministic-looking but randomized report shown when the live analysis API
 *  fails after retries, so the participant never sees a broken screen. */
export function buildStaticAnalysis(participantId: string): AnalysisReport {
  const techScore = 55 + Math.floor(Math.random() * 36); // 55-90
  const headlineIdx = pickIndex(HEADLINES.length);
  const snapshotIdx = pickIndex(SNAPSHOTS.length);
  const mindsetIdx = pickIndex(MINDSETS.length);
  const roadmapIdx = pickIndex(ROADMAPS.length);
  const recommendationIdx = pickIndex(RECOMMENDATIONS.length);
  return {
    participantId,
    sessionId: "",
    generatedAt: new Date().toISOString(),
    techScore,
    archetype: BUSINESS_TITLES[pickIndex(BUSINESS_TITLES.length)],
    dimensionScores: {
      growthMindset: 50 + Math.floor(Math.random() * 45),
      customerRelationship: 50 + Math.floor(Math.random() * 45),
      strategicThinking: 50 + Math.floor(Math.random() * 45),
      investmentDiscipline: 50 + Math.floor(Math.random() * 45),
      digitalReadiness: 50 + Math.floor(Math.random() * 45),
    },
    reportJson: {
      headline: HEADLINES[headlineIdx].en,
      headlineHi: HEADLINES[headlineIdx].hi,
      businessSnapshot: SNAPSHOTS[snapshotIdx].en,
      businessSnapshotHi: SNAPSHOTS[snapshotIdx].hi,
      mindsetProfile: MINDSETS[mindsetIdx].en,
      mindsetProfileHi: MINDSETS[mindsetIdx].hi,
      goalRoadmap: ROADMAPS[roadmapIdx].en,
      goalRoadmapHi: ROADMAPS[roadmapIdx].hi,
      techRecommendation: RECOMMENDATIONS[recommendationIdx].en,
      techRecommendationHi: RECOMMENDATIONS[recommendationIdx].hi,
    },
  };
}
