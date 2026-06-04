/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-category
 * Base block: columns
 * Source: https://shop.mango.com/es/es/h/home
 * Selector: div[class*="FamilyBannerShop-module"][class*="root"]
 * Description: Two-column side-by-side layout with large category images and
 *   category name heading links overlaid at the bottom. Used for category navigation tiles.
 * Generated: 2026-06-04
 *
 * Source DOM structure (per instance):
 *   div.FamilyBannerShop-module__*__root
 *     div.FamilyBannerShop-module__*__familyBannerWrapper  (one per column)
 *       a.BannerBackgroundLinkWrapper-module__*__link [href, title]
 *         div.*__fixed > picture > img           (category image)
 *         div.*__opacityFadeIn > ... > h2.title  (category name heading)
 *
 * Target table structure (from library example):
 *   | Columns |
 *   | ![Cat1](url) [Name1](url) | ![Cat2](url) [Name2](url) |
 */
export default function parse(element, { document }) {
  // Each direct child div with class containing "familyBannerWrapper" is a column/tile
  const wrappers = element.querySelectorAll(':scope > div[class*="familyBannerWrapper"]');

  // Build one cell per column: image + linked category name
  const columnCells = [];

  wrappers.forEach((wrapper) => {
    const cellContent = [];

    // The wrapper contains a single anchor link wrapping the entire category tile
    const link = wrapper.querySelector('a[class*="link"], a[href]');
    if (!link) return;

    const href = link.getAttribute('href') || '';

    // Extract the category image (picture element preferred, fallback to img)
    const picture = link.querySelector('picture');
    const img = link.querySelector('img');
    if (picture) {
      cellContent.push(picture);
    } else if (img) {
      cellContent.push(img);
    }

    // Extract the category name from the h2 heading inside the link
    const heading = link.querySelector('h2[class*="title"], h2');
    const categoryName = heading ? heading.textContent.trim() : link.textContent.trim();

    // Create a linked category name element
    if (categoryName && href) {
      const categoryLink = document.createElement('a');
      categoryLink.href = href;
      categoryLink.textContent = categoryName;
      cellContent.push(categoryLink);
    }

    if (cellContent.length > 0) {
      columnCells.push(cellContent);
    }
  });

  // Target structure: single row with N columns side by side
  // | ![Category 1](url) [Name 1](url) | ![Category 2](url) [Name 2](url) |
  const cells = [];
  if (columnCells.length > 0) {
    cells.push(columnCells);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-category', cells });
  element.replaceWith(block);
}
