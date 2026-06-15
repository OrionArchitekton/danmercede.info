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
        "@type": "WebPage",
        "@id": "https://www.danmercede.info/#webpage",
        "url": "https://www.danmercede.info/",
        "name": `${data.fullName} — Identity Verification`,
        "about": { "@id": "https://www.danmercede.com/#person" },
        "isPartOf": { "@id": "https://www.danmercede.info/#website" }
      },
      {
        "@type": "WebSite",
        "@id": "https://www.danmercede.info/#website",
        "url": "https://www.danmercede.info/",
        "publisher": { "@id": "https://www.danmercede.com/#person" }
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