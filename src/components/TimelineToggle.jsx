import React, { useState } from 'react';

export default function TimelineToggle({ variants }) {
  // Expects an array of objects: [{ source_work: "11/22/63", excerpt: "...", url: "..." }]
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="border border-archive-border rounded bg-archive-surface p-4 my-6">
      <div className="flex border-b border-archive-border mb-4 overflow-x-auto">
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
      <div className="font-serif text-archive-paper leading-relaxed">
        <p className="text-sm italic text-archive-accent mb-2">
          Alternative Chronological Perspective Active:
        </p>
        <p className="line-clamp-3 mb-4">{variants[activeTab].excerpt}</p>
        <a
          href={variants[activeTab].url}
          className="font-sans text-xs uppercase tracking-widest text-archive-terminal hover:underline"
        >
          Examine Full Archival File →
        </a>
      </div>
    </div>
  );
}
