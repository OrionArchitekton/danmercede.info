import React, { useEffect, useState } from 'react';
import { PROFILE_DATA } from './constants';
import { SchemaMarkup } from './components/SchemaMarkup';
import { generateIdentityChecksum } from './utils';

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-mono mb-4 mt-8 border-b border-neutral-200 pb-2 print:border-neutral-400 print:text-neutral-600">
    {title}
  </h2>
);

const DataRow: React.FC<{ label: string; value: string | React.ReactNode }> = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between py-1 group">
    <span className="text-neutral-500 font-mono text-sm w-48 shrink-0 print:text-neutral-600">{label}</span>
    <span className="text-neutral-900 font-medium text-sm sm:text-right print:text-black">{value}</span>
  </div>
);

const App: React.FC = () => {
  const {
    fullName,
    descriptor,
    location,
    lastUpdated,
    version,
    summary,
    links,
    currentPositions,
    platforms,
    timeline,
    education,
    disambiguation
  } = PROFILE_DATA;

  const [checksum, setChecksum] = useState<string>("CALCULATING...");

  useEffect(() => {
    generateIdentityChecksum(PROFILE_DATA).then(setChecksum);
  }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* JSON-LD Structured Data */}
      <SchemaMarkup data={PROFILE_DATA} />

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20 relative">

        {/* Print Affordance */}
        <div className="absolute top-6 right-6 no-print">
          <button
            onClick={() => window.print()}
            className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 hover:text-neutral-900 transition-colors border border-neutral-200 rounded px-2 py-1 hover:border-neutral-900"
          >
            Print / PDF
          </button>
        </div>

        {/* 1. Header (Minimal) */}
        <header className="mb-12 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 mb-2">
              {fullName}
            </h1>
            <p className="text-lg text-neutral-600 font-light mb-1 print:text-black">
              {descriptor}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs font-mono text-neutral-400 mt-4 print:text-neutral-600">
              <span>LOC: {location}</span>
              <span>UPD: {lastUpdated}</span>
              <span>VER: {version}</span>
            </div>
          </div>

          <div className="shrink-0 pt-1 sm:pt-0">
            <img
              src="https://storage.googleapis.com/cosmocrat/cosmocrat_logos_graphics/executive/dan-mercede-executive-authority.webp"
              alt="Dan Mercede"
              className="w-20 h-20 rounded-full border border-neutral-200 object-cover shadow-sm print:hidden"
            />
          </div>
        </header>

        {/* 2. Identity Summary */}
        <section>
          <SectionTitle title="01 // Identity Summary" />
          <div className="space-y-1">
            <DataRow label="Name" value={fullName} />
            <DataRow label="Primary Role" value={summary.primaryRole} />
            <DataRow label="Organization" value={summary.primaryOrg} />
            <DataRow label="Industry" value={summary.industry} />
            <DataRow label="Active" value={summary.yearsActive} />
          </div>
        </section>

        {/* 3. Canonical Links */}
        <section>
          <SectionTitle title="02 // Canonical Links" />
          <ul className="space-y-2 font-mono text-sm">
            {links.map((link) => (
              <li key={link.url} className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-neutral-500 w-48 print:text-neutral-600">{link.label}</span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-900 underline decoration-1 decoration-neutral-300 hover:decoration-neutral-900 transition-all underline-offset-4 print:no-underline print:text-black"
                >
                  {link.url.replace(/^https?:\/\//, '')}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. Current Positions */}
        <section>
          <SectionTitle title="03 // Current Positions" />
          <div className="space-y-4">
            {currentPositions.map((pos, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                <div>
                  <div className="text-neutral-900 font-semibold text-sm print:text-black">{pos.role}</div>
                  <div className="text-neutral-600 text-sm print:text-neutral-700">{pos.company}</div>
                </div>
                <div className="font-mono text-xs text-neutral-400 mt-1 sm:mt-0 print:text-neutral-600">
                  {pos.start} — {pos.end}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Platform & Product Associations */}
        <section>
          <SectionTitle title="04 // Platform Associations" />
          <ul className="space-y-3">
            {platforms.map((plat) => (
              <li key={plat.name} className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-semibold text-sm text-neutral-900 w-48 shrink-0 print:text-black">{plat.name}</span>
                <span className="text-sm text-neutral-600 sm:text-right print:text-neutral-700">{plat.description}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 6. Career Timeline */}
        <section>
          <SectionTitle title="05 // Timeline" />
          <div className="relative border-l border-neutral-200 ml-2 space-y-6 py-2 print:border-neutral-400">
            {timeline.map((item, idx) => (
              <div key={idx} className="pl-6 relative">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-neutral-100 border border-neutral-300 rounded-full print:bg-white print:border-black"></div>
                <div className="font-mono text-xs text-neutral-400 mb-0.5 print:text-neutral-600">
                  {item.start} – {item.end}
                </div>
                <div className="text-sm text-neutral-900 font-medium print:text-black">
                  {item.company}
                </div>
                {item.role !== "Various Operational Roles" && (
                  <div className="text-xs text-neutral-500 print:text-neutral-600">
                    {item.role}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 7. Education */}
        <section>
          <SectionTitle title="06 // Education" />
          {education.map((edu, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:justify-between mb-2">
              <div>
                <div className="text-neutral-900 text-sm font-medium print:text-black">{edu.institution}</div>
                <div className="text-neutral-600 text-xs print:text-neutral-700">{edu.degree}, {edu.field}</div>
              </div>
              {edu.year && <div className="font-mono text-xs text-neutral-400 print:text-neutral-600">{edu.year}</div>}
            </div>
          ))}
        </section>

        {/* 8. Disambiguation Notice */}
        <section className="bg-neutral-50 border border-neutral-100 p-6 mt-12 rounded-sm print:bg-white print:border print:border-neutral-300">
          <h3 className="font-mono text-xs text-neutral-500 uppercase tracking-widest mb-3 print:text-black">Disambiguation</h3>
          <p className="text-sm text-neutral-700 leading-relaxed max-w-2xl print:text-black">
            {disambiguation}
          </p>
        </section>

        {/* 9. Footer (Legal Minimal) */}
        <footer className="mt-20 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row justify-between text-xs text-neutral-400 font-mono print:border-neutral-400 print:text-black">
          <div>
            <p>{fullName}</p>
            <p>Jurisdiction: {location}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:items-end gap-1">
            <a
              href="https://danmercede.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors"
            >
              Context: danmercede.com
            </a>
            <p>&copy; {new Date().getFullYear()} All Rights Reserved.</p>
            <p>CHK: {checksum}</p>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default App;