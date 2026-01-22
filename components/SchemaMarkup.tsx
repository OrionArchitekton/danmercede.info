import React from 'react';
import { IdentityProfile } from '../types';

interface SchemaMarkupProps {
  data: IdentityProfile;
}

export const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ data }) => {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://danmercede.com/#danmercede",
        "name": data.fullName,
        "url": "https://danmercede.com/",
        "jobTitle": [data.summary.primaryRole, "Systems Architect"],
        "description": data.descriptor,
        "image": "https://danmercede.com/avatar.jpg", // Assumes existence or helpful placeholder
        "sameAs": data.links.map(link => link.url),
        "worksFor": { "@id": "https://orionapexcapital.com/#org" },
        "affiliation": [
          { "@id": "https://cosmocrat.ai/#org" },
          { "@id": "https://orionintelligenceagency.com/#org" }
        ],
        "knowsAbout": [
          "AI orchestration",
          "AI governance",
          "Enterprise AI reliability",
          "Algorithmic trading systems",
          "Automation"
        ],
        "alumniOf": {
          "@type": "CollegeOrUniversity",
          "name": data.education[0].institution
        }
      },
      {
        "@type": "Organization",
        "@id": "https://orionapexcapital.com/#org",
        "name": "Orion Apex Capital",
        "url": "https://orionapexcapital.com/",
        "founder": { "@id": "https://danmercede.com/#danmercede" }
      },
      {
        "@type": "Organization",
        "@id": "https://cosmocrat.ai/#org",
        "name": "Cosmocrat",
        "url": "https://cosmocrat.ai/",
        "parentOrganization": { "@id": "https://orionapexcapital.com/#org" }
      },
      {
        "@type": "Organization",
        "@id": "https://orionintelligenceagency.com/#org",
        "name": "Orion Intelligence Agency",
        "url": "https://orionintelligenceagency.com/",
        "parentOrganization": { "@id": "https://orionapexcapital.com/#org" }
      },
      {
        "@type": "WebPage",
        "@id": "https://danmercede.info/#webpage",
        "url": "https://danmercede.info/",
        "name": `${data.fullName} — Identity Verification`,
        "datePublished": "2025-01-01",
        "dateModified": new Date(data.lastUpdated).toISOString(),
        "isPartOf": { "@id": "https://danmercede.info/#website" },
        "about": { "@id": "https://danmercede.com/#danmercede" }
      },
      {
        "@type": "WebSite",
        "@id": "https://danmercede.info/#website",
        "url": "https://danmercede.info/",
        "name": "Dan Mercede Identity Verification"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};