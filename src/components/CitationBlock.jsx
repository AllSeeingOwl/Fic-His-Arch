import React from 'react';

export default function CitationBlock({ source }) {
  if (!source) return null;

  // Provide fallbacks if some frontmatter is missing to prevent crashes
  const {
    work = 'CLASSIFIED',
    medium = 'REDACTED',
    creator = 'UNKNOWN',
    release_year = 'YYYY',
    note = 'No context provided.',
  } = source;

  return (
    <footer className="mt-12 pt-6 border-t-2 border-dashed border-archive-border">
      <div className="bg-[#161917] p-6 rounded border border-archive-border">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-archive-accent animate-pulse" />
          <h4 className="font-sans text-xs uppercase tracking-widest font-semibold text-archive-accent">
            Official Source Attribution & Provenance
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-serif text-sm text-archive-muted">
          <div>
            <p>
              <span className="text-archive-accent">Fictional Blueprint:</span>{' '}
              <span className="text-archive-paper italic">“{work}”</span>
            </p>
            <p>
              <span className="text-archive-accent">Medium Typology:</span> {medium}
            </p>
            <p>
              <span className="text-archive-accent">Primary Originator:</span> {creator} (
              {release_year})
            </p>
          </div>
          <div className="border-l border-archive-border pl-4">
            <p className="text-xs italic leading-relaxed">
              <span className="text-archive-accent block not-italic font-sans text-[10px] uppercase tracking-wider mb-1">
                Structural Context:
              </span>
              {note}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
