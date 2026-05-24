import React from 'react';

export default function ArticleCard({ article }) {
  return (
    <article className="border border-archive-border bg-archive-surface p-6 rounded hover:border-archive-accent transition-all group">
      <div className="flex items-center justify-between text-xs font-sans text-archive-muted mb-2">
        <span>{article.dateline_location}</span>
        <span className="px-2 py-0.5 rounded border border-archive-border text-archive-accent bg-archive-bg text-[10px] font-semibold uppercase">
          {article.timeline_flair}
        </span>
      </div>
      
      <h3 className="font-display text-xl text-archive-paper group-hover:text-archive-accent transition-colors mb-2">
        {article.title}
      </h3>
      
      <p className="font-serif text-sm text-archive-muted line-clamp-2 mb-4">
        {article.summary}
      </p>
      
      <div className="flex items-center justify-between text-xs font-serif text-archive-muted pt-2 border-t border-archive-border/50">
        <span>In-Universe Date: <span className="text-archive-paper">{article.in_universe_date}</span></span>
        <span className="font-sans text-[10px] text-archive-terminal">FILE_LOGGED_</span>
      </div>
    </article>
  );
}