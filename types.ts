export interface Link {
  label: string;
  url: string;
  primary?: boolean;
}

export interface Position {
  role: string;
  company: string;
  start: string;
  end: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  year?: string;
}

export interface IdentityProfile {
  fullName: string;
  descriptor: string;
  location: string;
  lastUpdated: string;
  version: string;
  summary: {
    primaryRole: string;
    primaryOrg: string;
    industry: string;
    yearsActive: string;
  };
  links: Link[];
  currentPositions: Position[];
  platforms: {
    name: string;
    description: string;
  }[];
  timeline: Position[];
  education: Education[];
  disambiguation: string;
}