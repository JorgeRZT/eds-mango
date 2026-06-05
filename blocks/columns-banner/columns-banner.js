/**
 * Columns Banner Block
 * Two side-by-side image banners with category headings overlaid.
 *
 * Content structure (authored):
 *   Row 1: image links (image URLs as link hrefs - EDS auto-converts to <picture>)
 *   Row 2: headings (strong text for each column)
 *   Row 3: category links (the destination URLs)
 *
 * Decorated structure:
 *   .columns-banner
 *     .columns-banner-col (one per column)
 *       a.columns-banner-link (wraps everything, links to category)
 *         picture > img (the banner image)
 *         .columns-banner-label
 *           strong (category name)
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 3) return;

  const imageRow = rows[0];
  const headingRow = rows[1];
  const linkRow = rows[2];

  const imageCells = [...imageRow.children];
  const headingCells = [...headingRow.children];
  const linkCells = [...linkRow.children];

  const colCount = imageCells.length;

  // Clear the block
  block.innerHTML = '';

  if (colCount === 1) {
    block.classList.add('single');
  }

  for (let i = 0; i < colCount; i += 1) {
    const col = document.createElement('div');
    col.className = 'columns-banner-col';

    // Get the category link URL from row 3
    const linkEl = linkCells[i]?.querySelector('a');
    const categoryUrl = linkEl ? linkEl.href : '#';

    // Get the picture element from row 1 (EDS auto-converts image URL links to <picture>)
    const picture = imageCells[i]?.querySelector('picture');

    // Get the heading text from row 2
    const headingText = headingCells[i]?.textContent?.trim() || '';

    // Build the column structure
    const anchor = document.createElement('a');
    anchor.className = 'columns-banner-link';
    anchor.href = categoryUrl;

    if (picture) {
      anchor.appendChild(picture);
    }

    if (headingText) {
      const label = document.createElement('div');
      label.className = 'columns-banner-label';
      const strong = document.createElement('strong');
      strong.textContent = headingText;
      label.appendChild(strong);
      anchor.appendChild(label);
    }

    col.appendChild(anchor);
    block.appendChild(col);
  }
}
