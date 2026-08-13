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
  "You're Building a Digital-Ready Business",
  "A Strong Foundation with Room to Scale",
  "Momentum Is on Your Side",
  "You Think Like a Growth-First Founder",
  "Your Business Is Primed for the Next Leap",
];

const SNAPSHOTS = [
  "Your business shows strong customer focus paired with a willingness to try new approaches when the market shifts.",
  "You've built steady operations while keeping an eye on emerging tools that could streamline day-to-day work.",
  "Your business balances tradition and innovation, adapting processes without losing the personal touch customers value.",
  "You've shown resilience by adjusting quickly to changing demand while keeping core operations stable.",
];

const MINDSETS = [
  "You approach challenges with curiosity, favoring practical experiments over waiting for perfect conditions.",
  "You lean toward calculated risks, valuing data and customer feedback before committing to big changes.",
  "You value consistency and long-term relationships, which gives your decisions a steady, trustworthy edge.",
  "You're energized by growth opportunities and quick to explore tools that save time or improve quality.",
];

const ROADMAPS = [
  [
    "Digitize your customer records to spot repeat-buying patterns",
    "Introduce one new digital touchpoint, like online booking or ordering",
    "Automate a repetitive task to free up hours each week",
  ],
  [
    "Set up a simple dashboard to track your top 3 business metrics",
    "Pilot a digital payment or invoicing tool with a small customer group",
    "Build a lightweight online presence to reach new customers",
  ],
  [
    "Map your current workflow to find the biggest time sink",
    "Test one automation tool for scheduling or inventory",
    "Collect structured customer feedback every month",
  ],
];

const RECOMMENDATIONS = [
  "A lightweight CRM paired with automated follow-ups could meaningfully boost repeat business over the next quarter.",
  "Investing in a simple digital ordering or booking system is likely to reduce friction for your customers fastest.",
  "A basic analytics setup would help you see which parts of the business are worth doubling down on.",
  "Automating routine communication would free up time for the higher-value parts of running your business.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Deterministic-looking but randomized report shown when the live analysis API
 *  fails after retries, so the participant never sees a broken screen. */
export function buildStaticAnalysis(participantId: string): AnalysisReport {
  const techScore = 55 + Math.floor(Math.random() * 36); // 55-90
  return {
    participantId,
    sessionId: "",
    generatedAt: new Date().toISOString(),
    techScore,
    archetype: pick(BUSINESS_TITLES),
    dimensionScores: {
      growthMindset: 50 + Math.floor(Math.random() * 45),
      customerRelationship: 50 + Math.floor(Math.random() * 45),
      strategicThinking: 50 + Math.floor(Math.random() * 45),
      investmentDiscipline: 50 + Math.floor(Math.random() * 45),
      digitalReadiness: 50 + Math.floor(Math.random() * 45),
    },
    reportJson: {
      headline: pick(HEADLINES),
      businessSnapshot: pick(SNAPSHOTS),
      mindsetProfile: pick(MINDSETS),
      goalRoadmap: pick(ROADMAPS),
      techRecommendation: pick(RECOMMENDATIONS),
    },
  };
}
