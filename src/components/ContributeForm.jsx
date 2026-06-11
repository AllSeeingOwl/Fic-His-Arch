import React, { useState } from 'react';

const timelineFlairOptions = [
  'On Earth',
  'Not On Earth',
  'Alternate Timeline',
  'Time Travel',
  'Satire',
  'Canon Reference',
];

// ⚡ Bolt: Hoist RegEx to prevent re-allocation on every render/function call
const spaceRegex = /\s+/g;
const nonWordRegex = /[^\w\-]+/g;
const doubleDashRegex = /\-\-+/g;
const leadingDashRegex = /^-+/;
const trailingDashRegex = /-+$/;

const InfoTooltip = ({ text }) => {
  return (
    <div className="relative group inline-block ml-1">
      <span className="text-archive-accent cursor-help" tabIndex="0" aria-label="More info">
        [?]
      </span>
      <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-archive-surface border border-archive-border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 pointer-events-none text-xs text-archive-paper normal-case tracking-normal text-left font-sans">
        {text}
      </div>
    </div>
  );
};

export default function ContributeForm() {
  const [formData, setFormData] = useState({
    title: '',
    dateline_location: '',
    in_universe_date: '',
    timeline_flair: 'On Earth',
    source_work: '',
    source_medium: '',
    source_creator: '',
    release_year: '',
    context_note: '',
    image_url: '',
    multiverse_id: '',
    has_spoilers: false,
    adaptation_type: 'Original',
    adaptation_fidelity: 'Exact Match',
    body: '',
  });

  const [timelineVariants, setTimelineVariants] = useState([]);
  const [externalLinks, setExternalLinks] = useState([]);
  const [formErrors, setFormErrors] = useState([]);

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    const type = target.type;
    const checked = target.checked;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...timelineVariants];
    updatedVariants[index][field] = value;
    setTimelineVariants(updatedVariants);
  };

  const addVariant = () => {
    setTimelineVariants([...timelineVariants, { source_work: '', excerpt: '', url: '' }]);
  };

  const removeVariant = (index) => {
    setTimelineVariants(timelineVariants.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...externalLinks];
    updatedLinks[index][field] = value;
    setExternalLinks(updatedLinks);
  };

  const addLink = () => {
    setExternalLinks([...externalLinks, { name: '', url: '' }]);
  };

  const removeLink = (index) => {
    setExternalLinks(externalLinks.filter((_, i) => i !== index));
  };

  const generateMarkdown = () => {
    const {
      title,
      dateline_location,
      in_universe_date,
      timeline_flair,
      source_work,
      source_medium,
      source_creator,
      release_year,
      context_note,
      image_url,
      multiverse_id,
      has_spoilers,
      adaptation_type,
      adaptation_fidelity,
      body,
    } = formData;

    // Handle YAML escaping for title, context_note, etc if they have colons or quotes
    const escapeYaml = (str) => {
      if (!str) return "''";
      // If it contains quotes, colons, or newlines, wrap in single quotes and escape existing single quotes
      return `'${str.replace(/'/g, "''")}'`;
    };

    let md = `---\n`;
    md += `title: ${escapeYaml(title)}\n`;
    md += `dateline_location: ${escapeYaml(dateline_location)}\n`;
    md += `in_universe_date: ${escapeYaml(in_universe_date)}\n`;
    md += `timeline_flair: '${timeline_flair}'\n`;
    md += `source_work: ${escapeYaml(source_work)}\n`;
    md += `source_medium: ${escapeYaml(source_medium)}\n`;
    md += `source_creator: ${escapeYaml(source_creator)}\n`;
    md += `release_year: ${release_year}\n`;
    md += `context_note: ${escapeYaml(context_note)}\n`;

    if (image_url) {
      md += `image_url: ${escapeYaml(image_url)}\n`;
    }

    if (multiverse_id) {
      md += `multiverse_id: ${escapeYaml(multiverse_id)}\n`;
    }

    if (has_spoilers) {
      md += `has_spoilers: true\n`;
    }

    if (adaptation_type && adaptation_type !== 'Original') {
      md += `adaptation_type: '${adaptation_type}'\n`;
      md += `adaptation_fidelity: '${adaptation_fidelity}'\n`;
    }

    if (externalLinks.length > 0) {
      md += `external_links:\n`;
      externalLinks.forEach((link) => {
        md += `  - name: ${escapeYaml(link.name)}\n`;
        md += `    url: ${escapeYaml(link.url)}\n`;
      });
    }

    if (timelineVariants.length > 0) {
      md += `timelineVariants:\n`;
      timelineVariants.forEach((variant) => {
        md += `  - source_work: ${escapeYaml(variant.source_work)}\n`;
        md += `    excerpt: ${escapeYaml(variant.excerpt)}\n`;
        md += `    url: ${escapeYaml(variant.url)}\n`;
      });
    }

    md += `---\n\n`;
    md += body;

    return md;
  };

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(spaceRegex, '-')
      .replace(nonWordRegex, '')
      .replace(doubleDashRegex, '-')
      .replace(leadingDashRegex, '')
      .replace(trailingDashRegex, '');
  };

  const handleDownload = (e) => {
    e.preventDefault();
    setFormErrors([]);
    const errors = [];

    // Validation 1: Word Count
    const wordCount = formData.body
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    if (wordCount < 50 || wordCount > 1000) {
      errors.push(
        `Article content must be between 50 and 1000 words. Current word count: ${wordCount}.`
      );
    }

    // Validation 2: Spoilers
    if (formData.has_spoilers) {
      const spoilerRegex = /\|\|.*?\|\|/;
      if (!spoilerRegex.test(formData.body)) {
        errors.push(
          'You indicated the article contains spoilers, but no spoiler formatting (||...||) was found in the body.'
        );
      }
    }

    // Validation 3: External Links
    if (externalLinks.length < 2) {
      errors.push(
        'You must provide at least 2 external links to verify the historical anomaly. Please double-check your sources.'
      );
    }

    // Validation 4: Release Year
    const currentYear = new Date().getFullYear();
    const releaseYearNum = parseInt(formData.release_year, 10);
    if (isNaN(releaseYearNum) || releaseYearNum > currentYear) {
      errors.push(`Release year must be a valid year not in the future (<= ${currentYear}).`);
    }

    // Validation 5: Context Note
    const contextWordCount = formData.context_note
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    if (contextWordCount < 10) {
      errors.push(
        `Context note must be at least 10 words. Current word count: ${contextWordCount}.`
      );
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const mdContent = generateMarkdown();
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const filename = formData.title ? `${slugify(formData.title)}.md` : 'new-archive-entry.md';

    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-archive-surface border border-archive-border p-6 font-sans">
      <div className="mb-6 pb-2 border-b border-archive-border">
        <p className="text-xs uppercase tracking-widest text-archive-terminal">
          Terminal_Mode: Record Creation
        </p>
        <p className="text-xs uppercase tracking-widest text-archive-terminal">
          Output_Format: Markdown Archive (.md)
        </p>
      </div>

      {formErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
          <h3 className="font-display text-lg mb-2 text-red-400">Submission Errors</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {formErrors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleDownload} className="space-y-6">
        {/* Core Metadata */}
        <div className="space-y-4">
          <h4 className="font-display text-lg text-archive-accent border-b border-archive-border/50 pb-1">
            Core Metadata
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label
                htmlFor="title"
                className="block text-xs uppercase tracking-widest text-archive-muted mb-1 flex items-center"
              >
                Headline / Title{' '}
                <InfoTooltip text="The main title of the event or article. E.g., 'Rebel Alliance Destroys Imperial Superweapon'" />
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-archive-bg border border-archive-border rounded px-3 py-2 text-archive-paper focus:outline-none focus:border-archive-accent focus:ring-1 focus:ring-archive-accent"
                placeholder="e.g., Rebel Alliance Destroys Imperial Superweapon..."
              />
            </div>

            <div>
              <label
                htmlFor="dateline_location"
                className="block text-xs uppercase tracking-widest text-archive-muted mb-1 flex items-center"
              >
                Dateline Location{' '}
                <InfoTooltip text="Where the event primarily took place. E.g., 'Yavin 4 Orbit', 'Hogwarts'" />
              </label>
              <input
                type="text"
                id="dateline_location"
                name="dateline_location"
                required
                value={formData.dateline_location}
                onChange={handleChange}
                className="w-full bg-archive-bg border border-archive-border rounded px-3 py-2 text-archive-paper focus:outline-none focus:border-archive-accent focus:ring-1 focus:ring-archive-accent"
                placeholder="e.g., Yavin 4 Orbit"
              />
            </div>

            <div>
              <label
                htmlFor="in_universe_date"
                className="block text-xs uppercase tracking-widest text-archive-muted mb-1 flex items-center"
              >
                In-Universe Date{' '}
                <InfoTooltip text="The date according to the story's own calendar. E.g., 'Late 0 BBY', 'Stardate 43989.1'" />
              </label>
              <input
                type="text"
                id="in_universe_date"
                name="in_universe_date"
                required
                value={formData.in_universe_date}
                onChange={handleChange}
                className="w-full bg-archive-bg border border-archive-border rounded px-3 py-2 text-archive-paper focus:outline-none focus:border-archive-accent focus:ring-1 focus:ring-archive-accent"
                placeholder="e.g., Late 0 BBY"
              />
            </div>

            <div>
              <label
                htmlFor="timeline_flair"
                className="block text-xs uppercase tracking-widest text-archive-muted mb-1 flex items-center"
              >
                Timeline Flair{' '}
                <InfoTooltip text="Categorizes the nature of the timeline anomaly or setting." />
              </label>
              <select
                id="timeline_flair"
                name="timeline_flair"
                required
                value={formData.timeline_flair}
                onChange={handleChange}
                className="w-full bg-archive-bg border border-archive-border rounded px-3 py-2 text-archive-paper focus:outline-none focus:border-archive-accent focus:ring-1 focus:ring-archive-accent"
              >
                {timelineFlairOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="multiverse_id"
                className="block text-xs uppercase tracking-widest text-archive-muted mb-1"
              >
                Multiverse ID (Optional)
              </label>
              <input
                type="text"
                id="multiverse_id"
                name="multiverse_id"
                value={formData.multiverse_id}
                onChange={handleChange}
                className="w-full bg-archive-bg border border-archive-border rounded px-3 py-2 text-archive-paper focus:outline-none focus:border-archive-accent focus:ring-1 focus:ring-archive-accent"
                placeholder="Group ID for parallel universe events"
              />
            </div>
          </div>
        </div>

        {/* Source Citation */}
        <div className="space-y-4 mt-8">
          <h4 className="font-display text-lg text-archive-accent border-b border-archive-border/50 pb-1">
            Source Citation
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="source_work"
                className="block text-xs uppercase tracking-widest text-archive-muted mb-1 flex items-center"
              >
                Source Work{' '}
                <InfoTooltip text="The title of the media where this event originated. E.g., 'Star Wars: Episode IV - A New Hope'" />
              </label>
              <input
                type="text"
                id="source_work"
                name="source_work"
                required
                value={formData.source_work}
                onChange={handleChange}
                className="w-full bg-archive-bg border border-archive-border rounded px-3 py-2 text-archive-paper focus:outline-none focus:border-archive-accent focus:ring-1 focus:ring-archive-accent"
                placeholder="e.g., Star Wars: Episode IV..."
              />
            </div>

            <div>
              <label
                htmlFor="source_medium"
                className="block text-xs uppercase tracking-widest text-archive-muted mb-1 flex items-center"
              >
                Source Medium{' '}
                <InfoTooltip text="The format of the source material. E.g., 'Film', 'Book', 'Video Game'" />
              </label>
              <input
                type="text"
                id="source_medium"
                name="source_medium"
                required
                value={formData.source_medium}
                onChange={handleChange}
                className="w-full bg-archive-bg border border-archive-border rounded px-3 py-2 text-archive-paper focus:outline-none focus:border-archive-accent focus:ring-1 focus:ring-archive-accent"
                placeholder="e.g., Film, Book, Video Game"
              />
            </div>

            <div>
              <label
                htmlFor="source_creator"
                className="block text-xs uppercase tracking-widest text-archive-muted mb-1 flex items-center"
              >
                Source Creator{' '}
                <InfoTooltip text="The person or entity that created the source work. E.g., 'George Lucas', 'Nintendo'" />
              </label>
              <input
                type="text"
                id="source_creator"
                name="source_creator"
                required
                value={formData.source_creator}
                onChange={handleChange}
                className="w-full bg-archive-bg border border-archive-border rounded px-3 py-2 text-archive-paper focus:outline-none focus:border-archive-accent focus:ring-1 focus:ring-archive-accent"
                placeholder="e.g., George Lucas"
              />
            </div>

            <div>
              <label
                htmlFor="release_year"
                className="block text-xs uppercase tracking-widest text-archive-muted mb-1 flex items-center"
              >
                Release Year (Real World){' '}
                <InfoTooltip text="The actual real-world year the source material was released. E.g., '1977'" />
              </label>
              <input
                type="number"
                id="release_year"
                name="release_year"
                required
                value={formData.release_year}
                onChange={handleChange}
                className="w-full bg-archive-bg border border-archive-border rounded px-3 py-2 text-archive-paper focus:outline-none focus:border-archive-accent focus:ring-1 focus:ring-archive-accent"
                placeholder="e.g., 1977"
              />
            </div>

            <div>
              <label
                htmlFor="has_spoilers"
                className="flex items-center gap-2 cursor-pointer text-archive-paper"
              >
                <input
                  type="checkbox"
                  id="has_spoilers"
                  name="has_spoilers"
                  checked={formData.has_spoilers}
                  onChange={handleChange}
                  className="w-4 h-4 text-archive-accent bg-archive-bg border-archive-border rounded focus:ring-archive-accent"
                />
                <span className="text-xs uppercase tracking-widest">Contains Major Spoilers</span>
              </label>
              <p className="text-archive-muted text-[10px] mt-1 italic">
                Wrap spoiler text in double pipes (e.g., ||Darth Vader is his father||) to redact it
                in the final document.
              </p>
            </div>

            <div>
              <label
                htmlFor="adaptation_type"
                className="block text-xs uppercase tracking-widest text-archive-muted mb-1"
              >
                Adaptation Type
              </label>
              <select
                id="adaptation_type"
                name="adaptation_type"
                value={formData.adaptation_type}
                onChange={handleChange}
                className="w-full bg-archive-bg border border-archive-border rounded px-3 py-2 text-archive-paper focus:outline-none focus:border-archive-accent focus:ring-1 focus:ring-archive-accent"
              >
                <option value="Original">Original Work</option>
                <option value="Remake">Remake</option>
                <option value="Reboot">Reboot</option>
                <option value="Remaster">Remaster</option>
                <option value="Adaptation">Adaptation</option>
              </select>
            </div>

            {formData.adaptation_type !== 'Original' && (
              <div>
                <label
                  htmlFor="adaptation_fidelity"
                  className="block text-xs uppercase tracking-widest text-archive-muted mb-1"
                >
                  Adaptation Fidelity
                </label>
                <select
                  id="adaptation_fidelity"
                  name="adaptation_fidelity"
                  value={formData.adaptation_fidelity}
                  onChange={handleChange}
                  className="w-full bg-archive-bg border border-archive-border rounded px-3 py-2 text-archive-paper focus:outline-none focus:border-archive-accent focus:ring-1 focus:ring-archive-accent"
                >
                  <option value="Exact Match">Exact Match</option>
                  <option value="Minor Alterations">Minor Alterations</option>
                  <option value="Major Deviations">Major Deviations</option>
                </select>
              </div>
            )}

            <div className="md:col-span-2">
              <label
                htmlFor="context_note"
                className="block text-xs uppercase tracking-widest text-archive-muted mb-1 flex items-center"
              >
                Context Note{' '}
                <InfoTooltip text="A summary (min 10 words) of why this event is significant and how it changed its universe." />
              </label>
              <input
                type="text"
                id="context_note"
                name="context_note"
                required
                value={formData.context_note}
                onChange={handleChange}
                className="w-full bg-archive-bg border border-archive-border rounded px-3 py-2 text-archive-paper focus:outline-none focus:border-archive-accent focus:ring-1 focus:ring-archive-accent"
                placeholder="Short summary of why this event broke or reshaped its native universe..."
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="image_url"
                className="block text-xs uppercase tracking-widest text-archive-muted mb-1"
              >
                Image Path (Optional)
              </label>
              <input
                type="text"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full bg-archive-bg border border-archive-border rounded px-3 py-2 text-archive-paper focus:outline-none focus:border-archive-accent focus:ring-1 focus:ring-archive-accent"
                placeholder="e.g., /images/death-star.jpg"
              />
            </div>
          </div>
        </div>

        {/* External Links */}
        <div className="space-y-4 mt-8">
          <div className="flex justify-between items-end border-b border-archive-border/50 pb-1">
            <h4 className="font-display text-lg text-archive-accent">
              External References (Min. 2 Required)
            </h4>
            <button
              type="button"
              onClick={addLink}
              className="text-xs uppercase tracking-widest text-archive-terminal hover:text-archive-paper transition-colors"
            >
              + Add Link
            </button>
          </div>

          {externalLinks.map((link, index) => (
            <div
              key={index}
              className="p-4 border border-archive-border border-dashed bg-archive-bg/50 rounded relative"
            >
              <button
                type="button"
                onClick={() => removeLink(index)}
                className="absolute top-2 right-2 text-archive-muted hover:text-red-500 transition-colors text-xs uppercase"
              >
                Remove
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-archive-muted mb-1">
                    Source Name (e.g., Fandom Wiki, IMDb)
                  </label>
                  <input
                    type="text"
                    required
                    value={link.name}
                    onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
                    className="w-full bg-archive-bg border border-archive-border rounded px-3 py-2 text-archive-paper focus:outline-none focus:border-archive-accent"
                    placeholder="e.g., Star Wars Fandom"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-archive-muted mb-1">
                    URL
                  </label>
                  <input
                    type="text"
                    required
                    value={link.url}
                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                    className="w-full bg-archive-bg border border-archive-border rounded px-3 py-2 text-archive-paper focus:outline-none focus:border-archive-accent"
                    placeholder="e.g., https://starwars.fandom.com/..."
                  />
                </div>
              </div>
            </div>
          ))}

          {externalLinks.length === 0 && (
            <p className="text-sm text-archive-muted italic">
              Please add at least 2 external links to verify the historical anomaly.
            </p>
          )}
        </div>

        {/* Timeline Variants */}
        <div className="space-y-4 mt-8">
          <div className="flex justify-between items-end border-b border-archive-border/50 pb-1">
            <h4 className="font-display text-lg text-archive-accent">
              Timeline Variants (Optional)
            </h4>
            <button
              type="button"
              onClick={addVariant}
              className="text-xs uppercase tracking-widest text-archive-terminal hover:text-archive-paper transition-colors"
            >
              + Add Variant
            </button>
          </div>

          {timelineVariants.map((variant, index) => (
            <div
              key={index}
              className="p-4 border border-archive-border border-dashed bg-archive-bg/50 rounded relative"
            >
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="absolute top-2 right-2 text-archive-muted hover:text-red-500 transition-colors text-xs uppercase"
              >
                Remove
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-archive-muted mb-1">
                    Source Work
                  </label>
                  <input
                    type="text"
                    required
                    value={variant.source_work}
                    onChange={(e) => handleVariantChange(index, 'source_work', e.target.value)}
                    className="w-full bg-archive-bg border border-archive-border rounded px-3 py-2 text-archive-paper focus:outline-none focus:border-archive-accent"
                    placeholder="e.g., Fringe"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-archive-muted mb-1">
                    URL (Reference)
                  </label>
                  <input
                    type="text"
                    required
                    value={variant.url}
                    onChange={(e) => handleVariantChange(index, 'url', e.target.value)}
                    className="w-full bg-archive-bg border border-archive-border rounded px-3 py-2 text-archive-paper focus:outline-none focus:border-archive-accent"
                    placeholder="e.g., https://example.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-archive-muted mb-1">
                    Excerpt
                  </label>
                  <textarea
                    required
                    value={variant.excerpt}
                    onChange={(e) => handleVariantChange(index, 'excerpt', e.target.value)}
                    rows="2"
                    className="w-full bg-archive-bg border border-archive-border rounded px-3 py-2 text-archive-paper focus:outline-none focus:border-archive-accent"
                    placeholder="Brief description of the timeline variant..."
                  ></textarea>
                </div>
              </div>
            </div>
          ))}

          {timelineVariants.length === 0 && (
            <p className="text-sm text-archive-muted italic">
              No timeline variants added. Use this for multiversal events with different accounts.
            </p>
          )}
        </div>

        {/* Content Body */}
        <div className="space-y-4 mt-8">
          <h4 className="font-display text-lg text-archive-accent border-b border-archive-border/50 pb-1">
            Article Content
          </h4>

          <div>
            <label
              htmlFor="body"
              className="block text-xs uppercase tracking-widest text-archive-muted mb-1"
            >
              Report Body (Markdown supported)
            </label>
            <textarea
              id="body"
              name="body"
              rows="10"
              value={formData.body}
              onChange={handleChange}
              className="w-full bg-archive-bg border border-archive-border rounded px-3 py-2 text-archive-paper font-serif focus:outline-none focus:border-archive-accent focus:ring-1 focus:ring-archive-accent"
              placeholder="Write the main article content here..."
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-archive-accent text-archive-bg font-bold uppercase tracking-widest py-3 px-4 rounded hover:bg-opacity-90 transition-opacity mt-8"
        >
          Download Record (.md)
        </button>
      </form>
    </div>
  );
}
