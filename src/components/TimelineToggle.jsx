import React, { useState, useEffect } from 'react';

export default function TimelineToggle({ variants }) {
  if (!variants || variants.length === 0) return null;

  const [activeTab, setActiveTab] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="border border-archive-border rounded bg-archive-surface p-4 my-6">
      {/*
        Fallback for clients where JavaScript is disabled or fails.
        Shows all variants stacked vertically. We hide it once mounted (JS enabled).
      */}
      {!mounted && (
        <noscript>
          <div className="flex flex-col gap-6">
            {variants.map((v, idx) => (
              <div key={`fallback-${idx}`} className="border-b border-archive-border pb-4 last:border-0 last:pb-0">
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
                    className="font-sans text-xs uppercase tracking-widest text-archive-terminal hover:underline"
                  >
                    Examine Full Archival File →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </noscript>
      )}

      {/*
        Standard Interactive UI (Server-rendered statically with default state, then hydrated).
        We keep this structure in the HTML so that even if JS isn't available,
        CSS can show the first tab properly, though the buttons won't do anything
        unless they fall back to the noscript block above (if you hide this on no-js).
        In this case we just rely on standard React hydration.
      */}
      <div className={`transition-opacity ${mounted ? 'opacity-100' : 'opacity-100'} js-tabs-container`}>
        <div className="flex border-b border-archive-border mb-4 overflow-x-auto hide-on-nojs">
          {variants.map((v, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 font-sans text-sm font-medium uppercase tracking-wider transition-colors whitespace-nowrap ${
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
        <div className="font-serif text-archive-paper leading-relaxed hide-on-nojs">
          <p className="text-sm italic text-archive-accent mb-2">
            Alternative Chronological Perspective Active:
          </p>
          <p className="line-clamp-3 mb-4">{variants[activeTab].excerpt}</p>
          <a
            href={variants[activeTab].url || '#'}
            className="font-sans text-xs uppercase tracking-widest text-archive-terminal hover:underline"
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
  );
}
