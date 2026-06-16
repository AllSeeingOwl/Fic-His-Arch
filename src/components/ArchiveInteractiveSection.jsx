import React, { useState, useEffect } from 'react';
import CitationBlock from './CitationBlock';

export default function ArchiveInteractiveSection({ variants, defaultCitation }) {
  if (!variants || variants.length === 0) return null;

  const [activeTab, setActiveTab] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeVariant = variants[activeTab];

  // Construct the citation data based on whether the variant has citation fields.
  // If the variant lacks any citation field, it falls back to the defaultCitation (or part of it).
  // Often, variants might just have partial data, but since we added all data to JFK, it should work nicely.
  // We'll fall back to defaultCitation if fields are missing in the variant, just in case.
  const currentCitation = {
    title: defaultCitation.title, // Keep original title
    work: activeVariant.source_work || defaultCitation.work,
    medium: activeVariant.source_medium || defaultCitation.medium,
    creator: activeVariant.source_creator || defaultCitation.creator,
    release_year: activeVariant.release_year || defaultCitation.release_year,
    note: activeVariant.context_note || defaultCitation.note,
    external_links: activeVariant.external_links || defaultCitation.external_links,
  };

  return (
    <>
      <div className="border border-archive-border rounded bg-archive-surface p-4 my-6">
        {/*
          Fallback for clients where JavaScript is disabled or fails.
          Shows all variants stacked vertically. We hide it once mounted (JS enabled).
        */}
        {!mounted && (
          <noscript>
            <div className="flex flex-col gap-6">
              {variants.map((v, idx) => (
                <div
                  key={`fallback-${idx}`}
                  className="border-b border-archive-border pb-4 last:border-0 last:pb-0"
                >
                  <h3 className="font-sans text-sm font-medium uppercase tracking-wider text-archive-accent mb-2">
                    {v.source_work}
                  </h3>
                  <div className="font-serif text-archive-paper leading-relaxed">
                    <p className="text-sm italic text-archive-accent mb-2">
                      Alternative Chronological Perspective Active:
                    </p>
                    <p className="line-clamp-3 mb-4">{v.excerpt}</p>
                    <a
                      href={v.url || '#'}
                      className="font-sans text-xs uppercase tracking-widest text-archive-terminal hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-archive-accent rounded px-1 -ml-1"
                    >
                      Examine Full Archival File →
                    </a>
                  </div>

                  {/* Since CitationBlock is separate below, we could potentially render it here per variant in noscript,
                      but since we are replacing the global CitationBlock, we probably want a unified look.
                      However, in noscript we just show the base CitationBlock at the bottom. */}
                </div>
              ))}
            </div>
          </noscript>
        )}

        {/*
          Standard Interactive UI (Server-rendered statically with default state, then hydrated).
        */}
        <div
          className={`transition-opacity ${mounted ? 'opacity-100' : 'opacity-100'} js-tabs-container`}
        >
          <div
            className="flex border-b border-archive-border mb-4 overflow-x-auto hide-on-nojs"
            role="tablist"
            aria-label="Alternative Perspectives"
          >
            {variants.map((v, idx) => (
              <button
                key={idx}
                id={`tab-${idx}`}
                role="tab"
                aria-selected={activeTab === idx}
                aria-controls={`panel-${idx}`}
                className={`px-4 py-2 font-sans text-sm font-medium uppercase tracking-wider transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-archive-accent focus-visible:ring-inset ${
                  activeTab === idx
                    ? 'border-b-2 border-archive-accent text-archive-accent'
                    : 'text-archive-muted hover:text-archive-paper'
                }`}
                onClick={() => setActiveTab(idx)}
              >
                {v.source_work}
              </button>
            ))}
          </div>
          <div
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            tabIndex={0}
            className="font-serif text-archive-paper leading-relaxed hide-on-nojs focus:outline-none focus-visible:ring-2 focus-visible:ring-archive-accent rounded p-1"
          >
            <p className="text-sm italic text-archive-accent mb-2">
              Alternative Chronological Perspective Active:
            </p>
            <p className="line-clamp-3 mb-4">{activeVariant.excerpt}</p>
            <a
              href={activeVariant.url || '#'}
              className="font-sans text-xs uppercase tracking-widest text-archive-terminal hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-archive-accent rounded px-1"
            >
              Examine Full Archival File →
            </a>
          </div>
        </div>

        {/* Use standard global CSS to hide the interactive part when JS is disabled entirely */}
        <style>{`
          noscript + .js-tabs-container .hide-on-nojs {
             display: none;
          }
        `}</style>
      </div>

      <CitationBlock source={mounted ? currentCitation : defaultCitation} />
    </>
  );
}
