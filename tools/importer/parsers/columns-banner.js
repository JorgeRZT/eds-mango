/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-banner
 * Base block: columns
 * Source: https://shop.mango.com/es/es/h/home
 * Description: Two-column banner showing side-by-side linked category images with heading text overlaid on each.
 * Generated: 2026-06-05
 */
export default function parse(element, { document }) {
  // The root element contains direct child divs (familyBannerWrapper), each wrapping an <a> with picture + h2
  // Use :scope > div to get the direct child wrapper divs (not the <a> which also has the wrapper class)
  let columns = Array.from(element.querySelectorAll(':scope > div[class*="familyBannerWrapper"]'));

  // Fallback: if no class-based match, try direct child divs that contain links
  if (columns.length === 0) {
    columns = Array.from(element.querySelectorAll(':scope > div'));
  }

  // Build rows: row 1 = images, row 2 = headings, row 3 = links
  const imageRow = [];
  const headingRow = [];
  const linkRow = [];

  columns.forEach((col) => {
    const link = col.querySelector('a[href]');
    const img = col.querySelector('img');
    const heading = col.querySelector('h2, h3');

    // Image cell
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.getAttribute('src') || '';
      newImg.alt = heading ? heading.textContent.trim() : (img.getAttribute('alt') || '');
      imageRow.push(newImg);
    } else {
      imageRow.push('');
    }

    // Heading cell - bold heading text
    if (heading) {
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent.trim();
      headingRow.push(strong);
    } else {
      headingRow.push('');
    }

    // Link cell
    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.getAttribute('href');
      newLink.textContent = heading ? heading.textContent.trim() : (link.getAttribute('title') || 'Ver todo');
      linkRow.push(newLink);
    } else {
      linkRow.push('');
    }
  });

  const cells = [];

  // Row 1: Images (one per column)
  if (imageRow.length > 0) {
    cells.push(imageRow);
  }

  // Row 2: Headings (bold, one per column)
  if (headingRow.length > 0) {
    cells.push(headingRow);
  }

  // Row 3: Links (one per column)
  if (linkRow.length > 0) {
    cells.push(linkRow);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-banner', cells });
  element.replaceWith(block);
}
