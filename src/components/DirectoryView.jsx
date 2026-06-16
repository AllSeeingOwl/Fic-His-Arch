import React, { useState, useEffect, useMemo } from 'react';

// ⚡ Bolt: Hoist RegEx to prevent re-allocation on every render/function call
const yearRegex = /\b\d{3,4}\b/;
const spaceRegex = /\s+/g;

// ⚡ Bolt: Hoist Intl.Collator for faster sorting compared to inline String.prototype.localeCompare
const collator = new Intl.Collator('en', { numeric: true });

export default function DirectoryView({ articles }) {
  const [activeView, setActiveView] = useState('table'); // 'table' or 'timeline'
  const [mounted, setMounted] = useState(false);
  const [sortField, setSortField] = useState('in_universe_date');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const [groupBy, setGroupBy] = useState('none'); // 'none', 'year', 'location'
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const extractYear = (dateStr) => {
    if (!dateStr) return 'Unknown';
    // Match 3 or 4 digit years
    const match = dateStr.match(yearRegex);
    return match ? match[0] : dateStr;
  };

  const toggleGroup = (groupKey) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  // Sort based on selected field and direction
  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';

      const comparison = collator.compare(aVal, bVal);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [articles, sortField, sortDirection]);

  // Group the sorted articles
  const groupedArticles = useMemo(() => {
    if (groupBy === 'none') return { 'All Articles': sortedArticles };

    const groups = {};
    sortedArticles.forEach((article) => {
      let key;
      if (groupBy === 'year') {
        key = extractYear(article.in_universe_date);
      } else if (groupBy === 'location') {
        key = article.location || 'Unknown Location';
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(article);
    });
    return groups;
  }, [sortedArticles, groupBy]);

  // Automatically expand all groups when the grouping strategy changes
  useEffect(() => {
    if (groupBy !== 'none') {
      const newExpandedState = {};
      Object.keys(groupedArticles).forEach((key) => {
        newExpandedState[key] = true; // default to open
      });
      setExpandedGroups(newExpandedState);
    }
  }, [groupBy, groupedArticles]);

  if (!articles || articles.length === 0) {
    return <div className="text-archive-muted">No archival records found.</div>;
  }

  return (
    <div className="w-full my-6">
      {/* Toggle Controls (Hidden if JS is not enabled) */}
      <div
        className={`transition-opacity mb-6 hide-on-nojs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${mounted ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Group By Dropdown */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="groupBy"
            className="font-sans text-xs uppercase tracking-wider text-archive-muted"
          >
            Group By:
          </label>
          <select
            id="groupBy"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="bg-archive-surface border border-archive-border rounded px-3 py-1.5 font-sans text-sm text-archive-paper focus:outline-none focus:border-archive-accent"
          >
            <option value="none">None</option>
            <option value="year">Year / Era</option>
            <option value="location">Location</option>
          </select>
        </div>

        {/* View Toggles */}
        <div className="flex justify-end gap-2" role="group" aria-label="View selection">
          <button
            onClick={() => setActiveView('table')}
            aria-pressed={activeView === 'table'}
            className={`px-4 py-2 font-sans text-sm font-medium uppercase tracking-wider transition-colors border border-archive-border rounded-l focus:outline-none focus-visible:ring-2 focus-visible:ring-archive-accent focus-visible:ring-offset-2 focus-visible:ring-offset-archive-bg ${
              activeView === 'table'
                ? 'bg-archive-border text-archive-accent'
                : 'bg-archive-surface text-archive-muted hover:text-archive-paper'
            }`}
          >
            Master List
          </button>
          <button
            onClick={() => setActiveView('timeline')}
            aria-pressed={activeView === 'timeline'}
            className={`px-4 py-2 font-sans text-sm font-medium uppercase tracking-wider transition-colors border border-archive-border rounded-r focus:outline-none focus-visible:ring-2 focus-visible:ring-archive-accent focus-visible:ring-offset-2 focus-visible:ring-offset-archive-bg ${
              activeView === 'timeline'
                ? 'bg-archive-border text-archive-accent'
                : 'bg-archive-surface text-archive-muted hover:text-archive-paper'
            }`}
          >
            Timeline
          </button>
        </div>
      </div>

      {/*
        Table View
      */}
      {(!mounted || activeView === 'table') && (
        <div className={`${activeView === 'table' ? 'block' : 'hidden'} js-view-table`}>
          <div className="overflow-x-auto border border-archive-border rounded bg-archive-surface">
            <table className="w-full text-left font-serif text-archive-paper text-sm">
              <thead className="border-b border-archive-border bg-archive-bg font-sans text-xs uppercase tracking-wider text-archive-muted">
                <tr>
                  <th
                    className="font-normal"
                    aria-sort={
                      sortField === 'title'
                        ? sortDirection === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    <button
                      className="w-full text-left p-4 hover:text-archive-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-archive-accent focus-visible:ring-inset"
                      onClick={() => handleSort('title')}
                    >
                      Title{getSortIcon('title')}
                    </button>
                  </th>
                  <th
                    className="font-normal"
                    aria-sort={
                      sortField === 'in_universe_date'
                        ? sortDirection === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    <button
                      className="w-full text-left p-4 hover:text-archive-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-archive-accent focus-visible:ring-inset"
                      onClick={() => handleSort('in_universe_date')}
                    >
                      In-Universe Date{getSortIcon('in_universe_date')}
                    </button>
                  </th>
                  <th
                    className="font-normal"
                    aria-sort={
                      sortField === 'location'
                        ? sortDirection === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    <button
                      className="w-full text-left p-4 hover:text-archive-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-archive-accent focus-visible:ring-inset"
                      onClick={() => handleSort('location')}
                    >
                      Location{getSortIcon('location')}
                    </button>
                  </th>
                  <th
                    className="font-normal"
                    aria-sort={
                      sortField === 'source_work'
                        ? sortDirection === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    <button
                      className="w-full text-left p-4 hover:text-archive-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-archive-accent focus-visible:ring-inset"
                      onClick={() => handleSort('source_work')}
                    >
                      Source Work{getSortIcon('source_work')}
                    </button>
                  </th>
                </tr>
              </thead>
              {Object.entries(groupedArticles).map(([groupName, groupArticles]) => {
                const groupId = groupName.replace(spaceRegex, '-');
                return (
                  <tbody
                    key={groupName}
                    id={`group-${groupId}`}
                    className="divide-y divide-archive-border"
                  >
                    {groupBy !== 'none' && (
                      <tr className="bg-archive-border transition-colors hover:bg-archive-border/80">
                        <td
                          colSpan="4"
                          className="p-0 font-sans text-xs uppercase tracking-wider text-archive-paper"
                        >
                          <button
                            className="w-full flex items-center gap-2 p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-archive-accent focus-visible:ring-inset text-left"
                            onClick={() => toggleGroup(groupName)}
                            aria-expanded={expandedGroups[groupName] ? 'true' : 'false'}
                            aria-controls={`group-${groupId}`}
                          >
                            <span
                              className={`transform transition-transform ${expandedGroups[groupName] ? 'rotate-90' : ''}`}
                            >
                              ▶
                            </span>
                            <span className="font-bold">{groupName}</span>
                            <span className="text-archive-muted">
                              ({groupArticles.length}{' '}
                              {groupArticles.length === 1 ? 'event' : 'events'})
                            </span>
                          </button>
                        </td>
                      </tr>
                    )}

                    {(groupBy === 'none' || expandedGroups[groupName]) &&
                      groupArticles.map((article) => (
                        <tr key={article.id} className="hover:bg-archive-bg transition-colors">
                          <td className="p-4">
                            <a
                              href={article.url}
                              className="text-archive-accent hover:underline font-medium block"
                            >
                              {article.title}
                            </a>
                          </td>
                          <td className="p-4 whitespace-nowrap text-archive-muted">
                            {article.in_universe_date}
                          </td>
                          <td className="p-4">{article.location}</td>
                          <td className="p-4 italic text-archive-muted">{article.source_work}</td>
                        </tr>
                      ))}
                  </tbody>
                );
              })}
            </table>
          </div>
        </div>
      )}

      {/*
        Timeline View
      */}
      {(!mounted || activeView === 'timeline') && (
        <div className={`${activeView === 'timeline' ? 'block' : 'hidden'} js-view-timeline`}>
          <div className="relative border-l-2 border-archive-border ml-4 sm:ml-6 md:ml-8 pb-4">
            {Object.entries(groupedArticles).map(([groupName, groupArticles]) => {
              const groupId = groupName.replace(spaceRegex, '-');
              return (
                <div key={groupName} className="mb-8 relative">
                  {/* Group Header (if grouping is enabled) */}
                  {groupBy !== 'none' && (
                    <div className="ml-6 sm:ml-8 md:ml-10 mb-6 flex items-center group relative">
                      {/* Timeline dot for group */}
                      <div className="absolute -left-[33px] sm:-left-[41px] md:-left-[49px] w-5 h-5 bg-archive-bg border-2 border-archive-paper rounded-full group-hover:border-archive-accent transition-colors flex items-center justify-center pointer-events-none">
                        <div className="w-1.5 h-1.5 bg-archive-paper rounded-full group-hover:bg-archive-accent transition-colors"></div>
                      </div>

                      <button
                        className="bg-archive-border rounded px-4 py-2 font-sans text-sm uppercase tracking-wider text-archive-paper shadow-sm flex items-center gap-3 w-full sm:w-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-archive-accent focus-visible:ring-inset text-left cursor-pointer"
                        onClick={() => toggleGroup(groupName)}
                        aria-expanded={expandedGroups[groupName] ? 'true' : 'false'}
                        aria-controls={`timeline-group-${groupId}`}
                      >
                        <span
                          className={`transform transition-transform text-archive-accent ${expandedGroups[groupName] ? 'rotate-90' : ''}`}
                        >
                          ▶
                        </span>
                        <span className="font-bold">{groupName}</span>
                        <span className="text-archive-muted text-xs bg-archive-bg px-2 py-0.5 rounded">
                          {groupArticles.length} {groupArticles.length === 1 ? 'event' : 'events'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Render Articles if group is expanded (or if no grouping) */}
                  {(groupBy === 'none' || expandedGroups[groupName]) && (
                    <div
                      id={`timeline-group-${groupId}`}
                      className={
                        groupBy !== 'none'
                          ? 'ml-4 sm:ml-8 md:ml-12 border-l border-dashed border-archive-border/50 pb-4'
                          : ''
                      }
                    >
                      {groupArticles.map((article) => (
                        <div key={article.id} className="mb-8 ml-6 sm:ml-8 md:ml-10 relative group">
                          {/* Timeline dot for individual article */}
                          <div className="absolute -left-[35px] sm:-left-[43px] md:-left-[51px] top-2 w-4 h-4 bg-archive-bg border-2 border-archive-accent rounded-full group-hover:bg-archive-accent transition-colors"></div>

                          <div className="bg-archive-surface border border-archive-border rounded p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 mb-2">
                              <h3 className="font-display text-xl text-archive-paper">
                                <a
                                  href={article.url}
                                  className="hover:text-archive-accent transition-colors"
                                >
                                  {article.title}
                                </a>
                              </h3>
                              <span className="font-sans text-xs uppercase tracking-widest text-archive-terminal bg-archive-bg px-2 py-1 rounded border border-archive-border self-start sm:self-auto">
                                {article.in_universe_date}
                              </span>
                            </div>

                            <div className="font-sans text-xs uppercase tracking-wider text-archive-muted mb-4 flex flex-wrap gap-4">
                              <span className="flex items-center gap-1">
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  ></path>
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  ></path>
                                </svg>
                                {article.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                  ></path>
                                </svg>
                                {article.source_work}
                              </span>
                            </div>

                            <p className="font-serif text-sm text-archive-paper/80 mb-4 line-clamp-2">
                              {article.context_note}
                            </p>

                            <a
                              href={article.url}
                              className="inline-block font-sans text-xs uppercase tracking-widest text-archive-accent hover:text-archive-paper transition-colors"
                            >
                              View File Details →
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        noscript .hide-on-nojs {
           display: none;
        }
        /* When no JS, force show table view as default list and hide timeline view to prevent duplicate content */
        noscript .js-view-table {
           display: block !important;
        }
        noscript .js-view-timeline {
           display: none !important;
        }
      `}</style>
    </div>
  );
}
