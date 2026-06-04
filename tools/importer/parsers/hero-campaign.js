/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-campaign block.
 * Matches full-viewport hero banners with text heading + CTA overlay.
 */
export default function parse(element, { document }) {
  if (element.querySelector('[class*="HeroBannerShopTitleImage-module"]')) return;

  const video = element.querySelector('video');
  const picture = element.querySelector('picture');
  const img = element.querySelector('img[class*="BannerResponsiveImage"]') || element.querySelector('img');
  const heading = element.querySelector('[class*="heroBannerShopTitle"], h2, h1');
  const ctaTextEl = element.querySelector('[class*="heroBannerShopCtaText"], [class*="HeroBannerShopCtas-module"]');
  const parentLink = element.closest('a')
    || (element.parentElement && element.parentElement.tagName === 'A' ? element.parentElement : null)
    || element.querySelector('a');

  const cells = [];

  if (video) {
    const posterUrl = video.getAttribute('poster') || '';
    if (posterUrl) {
      const posterImg = document.createElement('img');
      posterImg.src = posterUrl;
      posterImg.alt = '';
      cells.push([posterImg]);
    }
  } else if (picture) {
    cells.push([picture.cloneNode(true)]);
  } else if (img) {
    cells.push([img.cloneNode(true)]);
  }

  if (heading) {
    const h = document.createElement('h1');
    h.textContent = heading.textContent.trim();
    cells.push([h]);
  }

  const ctaText = ctaTextEl ? ctaTextEl.textContent.trim() : '';
  const ctaHref = parentLink ? (parentLink.getAttribute('href') || '') : '';

  if (ctaText && ctaHref) {
    const ctaLink = document.createElement('a');
    ctaLink.href = ctaHref;
    ctaLink.textContent = ctaText;
    cells.push([ctaLink]);
  } else if (ctaHref) {
    const ctaLink = document.createElement('a');
    ctaLink.href = ctaHref;
    ctaLink.textContent = 'Descubre más';
    cells.push([ctaLink]);
  }

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-campaign', cells });
  element.replaceWith(block);
}
