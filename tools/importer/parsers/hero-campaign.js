/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-campaign
 * Base block: hero
 * Source: https://shop.mango.com/es/es/h/home
 * Generated: 2026-06-04
 *
 * Full-width campaign hero with background video/image, heading overlay, and CTA link.
 * The matched element is wrapped in a parent <a> that provides the navigation URL.
 */
export default function parse(element, { document }) {
  // Extract background media: video (with poster) or image
  const video = element.querySelector('video');
  const picture = element.querySelector('picture');
  const img = element.querySelector('img');

  // Extract the heading
  const heading = element.querySelector('h2, h1');

  // Extract CTA text from the banner CTA div
  const ctaTextEl = element.querySelector('[class*="HeroBannerShopCtas-module"], [class*="heroBannerShopCtaText"]');

  // The parent <a> wraps the entire banner and provides the CTA href
  const parentLink = element.parentElement && element.parentElement.tagName === 'A'
    ? element.parentElement
    : element.querySelector('a');

  const cells = [];

  // Row 1: Background media (poster image from video, or picture/img)
  if (video) {
    const posterUrl = video.getAttribute('poster') || '';
    if (posterUrl) {
      const posterImg = document.createElement('img');
      posterImg.src = posterUrl;
      posterImg.alt = '';
      cells.push([posterImg]);
    }
  } else if (picture) {
    cells.push([picture]);
  } else if (img) {
    cells.push([img]);
  }

  // Row 2: Heading
  if (heading) {
    const h = document.createElement('h1');
    h.textContent = heading.textContent.trim();
    cells.push([h]);
  }

  // Row 3: CTA link
  const ctaText = ctaTextEl ? ctaTextEl.textContent.trim() : '';
  const ctaHref = parentLink ? (parentLink.getAttribute('href') || '') : '';

  if (ctaText && ctaHref) {
    const ctaLink = document.createElement('a');
    ctaLink.href = ctaHref;
    ctaLink.textContent = ctaText;
    cells.push([ctaLink]);
  } else if (ctaText) {
    const p = document.createElement('p');
    p.textContent = ctaText;
    cells.push([p]);
  } else if (ctaHref) {
    const ctaLink = document.createElement('a');
    ctaLink.href = ctaHref;
    ctaLink.textContent = ctaHref;
    cells.push([ctaLink]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-campaign', cells });
  element.replaceWith(block);
}
