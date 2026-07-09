import { IdentityProfile } from './types';

// Static date ensures the checksum remains deterministic.
// Update this manually when content changes.
const LAST_UPDATED = "2026-07-09";
const VERSION = "v2026.07.09";

export const PROFILE_DATA: IdentityProfile = {
  fullName: "Dan Mercede",
  descriptor: "Founder, operator, and systems builder",
  location: "San Diego, CA",
  lastUpdated: LAST_UPDATED,
  version: VERSION,
  summary: {
    primaryRole: "Founder & AI Systems Architect (operator and workflow ownership)",
    primaryOrg: "Orion Apex Capital",
    industry: "Applied Artificial Intelligence / FinTech",
    yearsActive: "2015-Present"
  },
  links: [
    { label: "danmercede.com", url: "https://danmercede.com", primary: true },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/danmercede", primary: true },
    { label: "X", url: "https://x.com/danmercede" },
    { label: "GitHub", url: "https://github.com/OrionArchitekton" },
    { label: "dev.to", url: "https://dev.to/danmercede" },
    { label: "Hashnode", url: "https://danmercede.hashnode.dev" },
    { label: "YouTube", url: "https://www.youtube.com/@danmercede" },
    { label: "Sessionize", url: "https://sessionize.com/dan-mercede/" },
    { label: "Orion Apex Capital", url: "https://orionapexcapital.com" },
    { label: "Cosmocrat", url: "https://cosmocrat.ai" }
  ],
  currentPositions: [
    {
      role: "Founder & Systems Architect",
      company: "Orion Apex Capital",
      start: "2025",
      end: "Present"
    },
    {
      role: "Director, Applied AI & Orchestration",
      company: "Orion Intelligence Agency",
      start: "2025",
      end: "Present"
    }
  ],
  platforms: [
    { name: "Cosmocrat", description: "Governed AI Operating System: runtime enforcement, audit receipts, execution control plane" },
    { name: "Orion Intelligence Agency", description: "SMB AI strategy consulting: helps small and mid-sized operators turn one high-friction workflow into an AI-assisted system the team can run (strategy, leadership facilitation, engineering, agents). Builds and deploys, not just advises." },
    { name: "ReplyBy", description: "Communication automation product" },
    { name: "Apex Trading Systems", description: "Internal execution system" },
    { name: "Path of Life Hub", description: "Consumer signal platform" }
  ],
  timeline: [
    {
      role: "Founder & Systems Architect",
      company: "Orion Apex Capital",
      start: "2025",
      end: "Present"
    },
    {
      role: "Director, Applied AI & Orchestration",
      company: "Orion Intelligence Agency",
      start: "2025",
      end: "Present"
    },
    {
      role: "General Manager",
      company: "24 Hour Fitness",
      start: "2021",
      end: "2025"
    },
    {
      role: "Various Operational Roles",
      company: "Previous Tenures",
      start: "Pre",
      end: "2021"
    }
  ],
  education: [
    {
      institution: "Queen's School of Business, Queen's University",
      degree: "Bachelor of Arts (B.A.)",
      field: "Economics",
      year: "2011"
    }
  ],
  disambiguation: "This profile refers to Dan Mercede, an operator and systems builder working in artificial intelligence, automation, and financial systems. The identity documented here is specific to professional work turning AI experiments into owned, governed workflows teams can run, with governance and reliability as proof depth."
};

export type ImageMeta = { alt: string; description?: string };

export const IMAGE_METADATA = {
  // Executive / Authority Set
  "dan-mercede-executive-authority-avatar.webp": {
    alt: "Dan Mercede, founder, operator, and systems builder",
    description:
      "Executive portrait of Dan Mercede, founder and operator focused on owned AI workflows and systems teams can run.",
  },
  "dan-mercede-executive-outdoor.png": {
    alt: "Dan Mercede, founder and systems architect for operator-led AI workflows",
    description:
      "Outdoor executive portrait of Dan Mercede, founder and systems architect specializing in workflow ownership and governed AI as proof depth.",
  },
  "dan-mercede-executive-relaxed.png": {
    alt: "Dan Mercede, founder and systems architect for operator-led AI workflows",
    description:
      "Relaxed executive portrait of Dan Mercede, founder and systems architect working on owned workflows and AI-assisted systems.",
  },

  // Founder / Working Headshots
  "dan-mercede-founder-headshot.png": {
    alt: "Dan Mercede working as founder and systems architect on operator-led AI systems",
    description:
      "Founder headshot of Dan Mercede, actively building and operating AI-assisted workflows with a focus on execution and ownership.",
  },
  "dan-mercede-founder-headshot-sm.png": {
    alt: "Dan Mercede working as founder and systems architect on operator-led AI systems",
    description:
      "Scaled founder headshot of Dan Mercede focused on hands-on AI system design and workflow ownership.",
  },
  "dan-mercede-founder-headshot-xs.png": {
    alt: "Dan Mercede working as founder and systems architect on operator-led AI systems",
    description:
      "Compact founder headshot of Dan Mercede emphasizing hands-on work turning AI into owned workflows.",
  },

  // Founder / Social & Working Context
  "dan-mercede-founder-social-landscape.png": {
    alt: "Dan Mercede, founder and systems architect in a working environment",
    description:
      "Landscape portrait of Dan Mercede in a casual working environment, representing hands-on leadership in operator-led AI systems.",
  },
  "dan-mercede-founder-social-portrait.png": {
    alt: "Dan Mercede, founder and systems architect in a working environment",
    description:
      "Portrait of Dan Mercede in a social working context, reflecting active system design and founder-led execution.",
  },
  "dan-mercede-founder-working-landscape.png": {
    alt: "Dan Mercede working as founder and systems architect on operator-led AI systems",
    description:
      "Landscape image of Dan Mercede actively working on AI workflow architecture and execution.",
  },
  "dan-mercede-founder-working-portrait.png": {
    alt: "Dan Mercede working as founder and systems architect on operator-led AI systems",
    description:
      "Portrait of Dan Mercede in a focused working setting, emphasizing hands-on system building and workflow ownership.",
  },
} as const satisfies Record<string, ImageMeta>;

const basename = (src: string) => src.split("/").pop() || src;

export function getImageMeta(srcOrFilename: string): ImageMeta {
  const key = basename(srcOrFilename);
  const meta = (IMAGE_METADATA as Record<string, ImageMeta>)[key];

  if (!meta) {
    // Dev: fail loud. Prod: safe fallback.
    if (import.meta.env.DEV) {
      throw new Error(`Missing IMAGE_METADATA for: ${key}`);
    }
    return { alt: "Dan Mercede", description: undefined };
  }

  return meta;
}
