/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner
 * Base block: hero
 * Source: https://shop.mango.com/es/es/h/home
 * Generated: 2026-06-05
 *
 * Extracts a full-width static image background banner with centered text overlay
 * (H2 heading + CTA text). Used for sections like "TOTAL WHITE", "LINO".
 *
 * Target structure (from block library):
 *   Row 1: Background image
 *   Row 2: Heading
 *   Row 3: Description/CTA link
 */
export default function parse(element, { document }) {
  // Extract background image from picture element
  const picture = element.querySelector('picture[class*="BannerResponsiveImage-module"], picture');
  const img = element.querySelector('img[class*="BannerResponsiveImage-module"], img');

  // Extract heading (h2 with HeroBannerShopTitle class)
  const heading = element.querySelector(
    'h2[class*="HeroBannerShopTitle-module"], h2[class*="heroBannerShopTitle"], h1, h2'
  );

  // Extract CTA text (div with HeroBannerShopCtas class)
  const ctaElement = element.querySelector(
    'div[class*="HeroBannerShopCtas-module"], div[class*="heroBannerShopCtaText"], [class*="HeroBannerShopCta"]'
  );

  // Check if there's a wrapping link (BannerBackgroundLinkWrapper)
  const wrapperLink = element.querySelector(
    'a[class*="BannerBackgroundLink"], a[class*="bannerBackgroundLink"], a[href]'
  );

  // Build cells to match block library structure
  const cells = [];

  // Row 1: Background image
  if (picture) {
    cells.push([picture]);
  } else if (img) {
    cells.push([img]);
  }

  // Row 2: Heading
  if (heading) {
    // Create a clean h2 element preserving the heading text
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    cells.push([h2]);
  }

  // Row 3: CTA link (wrap text in anchor if wrapping link exists, else use text)
  if (ctaElement) {
    const ctaText = ctaElement.textContent.trim();
    if (wrapperLink && wrapperLink.href) {
      const link = document.createElement('a');
      link.href = wrapperLink.href;
      link.textContent = ctaText;
      cells.push([link]);
    } else {
      // CTA as plain text (no link available in source)
      const p = document.createElement('p');
      p.textContent = ctaText;
      cells.push([p]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
