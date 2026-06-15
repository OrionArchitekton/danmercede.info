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
        "@id": "https://www.danmercede.info/#person",
        "name": data.fullName,
        "url": "https://www.danmercede.info/",
        "jobTitle": "Runtime Governance Architect & Technology Executive",
        "sameAs": ["https://www.danmercede.com/"]
      },
      {
        "@type": "WebPage",
        "@id": "https://www.danmercede.info/#webpage",
        "url": "https://www.danmercede.info/",
        "name": `${data.fullName} — Identity Verification`,
        "about": { "@id": "https://www.danmercede.info/#person" },
        "isPartOf": { "@id": "https://www.danmercede.info/#website" }
      },
      {
        "@type": "WebSite",
        "@id": "https://www.danmercede.info/#website",
        "url": "https://www.danmercede.info/",
        "publisher": { "@id": "https://www.danmercede.info/#person" }
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