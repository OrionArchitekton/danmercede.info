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