import { IdentityProfile } from './types';

// Static date ensures the checksum remains deterministic.
// Update this manually when content changes.
const LAST_UPDATED = "2025-05-21";
const VERSION = "v2025.05.21";

export const PROFILE_DATA: IdentityProfile = {
  fullName: "Dan Mercede",
  descriptor: "Systems Architect & Technology Executive",
  location: "California, USA",
  lastUpdated: LAST_UPDATED,
  version: VERSION,
  summary: {
    primaryRole: "Founder & Systems Architect (Governed AI Operating Systems)",
    primaryOrg: "Orion Apex Capital",
    industry: "Applied Artificial Intelligence / FinTech",
    yearsActive: "2015–Present"
  },
  links: [
    { label: "danmercede.com", url: "https://danmercede.com", primary: true },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/danmercede", primary: true },
    { label: "GitHub", url: "https://github.com/OrionArchitekton" },
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
    { name: "Cosmocrat", description: "Governed AI Operating System" },
    { name: "Orion Intelligence Agency", description: "Enterprise AI reliability engineering" },
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
  disambiguation: "This profile refers to Dan Mercede, a technology executive and systems architect operating in the fields of artificial intelligence, automation, and financial systems. The identity documented here is specific to professional work involving AI orchestration, governed execution systems, and enterprise technology platforms."
};

export type ImageMeta = { alt: string; description?: string };

export const IMAGE_METADATA = {
  // Executive / Authority Set
  "dan-mercede-executive-authority.png": {
    alt: "Dan Mercede, Founder & Systems Architect of a governed AI operating system",
    description:
      "Executive portrait of Dan Mercede, founder and systems architect focused on governed AI systems and enterprise control planes.",
  },
  "dan-mercede-executive-outdoor.png": {
    alt: "Dan Mercede, Founder & Systems Architect of a governed AI operating system",
    description:
      "Outdoor executive portrait of Dan Mercede, founder and systems architect specializing in governed AI and system control architecture.",
  },
  "dan-mercede-executive-relaxed.png": {
    alt: "Dan Mercede, Founder & Systems Architect of a governed AI operating system",
    description:
      "Relaxed executive portrait of Dan Mercede, founder and systems architect working in governed AI and enterprise AI governance.",
  },

  // Founder / Working Headshots
  "dan-mercede-founder-headshot.png": {
    alt: "Dan Mercede working as founder and systems architect on governed AI systems",
    description:
      "Founder headshot of Dan Mercede, actively building and operating governed AI systems with a focus on execution and architecture.",
  },
  "dan-mercede-founder-headshot-sm.png": {
    alt: "Dan Mercede working as founder and systems architect on governed AI systems",
    description:
      "Scaled founder headshot of Dan Mercede focused on hands-on AI system design and governance.",
  },
  "dan-mercede-founder-headshot-xs.png": {
    alt: "Dan Mercede working as founder and systems architect on governed AI systems",
    description:
      "Compact founder headshot of Dan Mercede emphasizing hands-on work in governed AI systems.",
  },

  // Founder / Social & Working Context
  "dan-mercede-founder-social-landscape.png": {
    alt: "Dan Mercede, founder and systems architect in a working environment",
    description:
      "Landscape portrait of Dan Mercede in a casual working environment, representing hands-on leadership in governed AI systems.",
  },
  "dan-mercede-founder-social-portrait.png": {
    alt: "Dan Mercede, founder and systems architect in a working environment",
    description:
      "Portrait of Dan Mercede in a social working context, reflecting active system design and founder-led execution.",
  },
  "dan-mercede-founder-working-landscape.png": {
    alt: "Dan Mercede working as founder and systems architect on governed AI systems",
    description:
      "Landscape image of Dan Mercede actively working on governed AI system architecture and execution.",
  },
  "dan-mercede-founder-working-portrait.png": {
    alt: "Dan Mercede working as founder and systems architect on governed AI systems",
    description:
      "Portrait of Dan Mercede in a focused working setting, emphasizing hands-on system building and AI governance.",
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
