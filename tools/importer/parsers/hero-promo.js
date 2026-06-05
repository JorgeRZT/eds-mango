/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-promo variant.
 * Base block: hero
 * Source: https://shop.mango.com/es/es/h/home
 * Generated: 2026-06-05
 *
 * Extracts: background image, logo/brand image overlay, and CTA link.
 * Key difference from hero-banner: uses HeroBannerShopTitleImage (logo image)
 * instead of HeroBannerShopTitle (text heading).
 */
export default function parse(element, { document }) {
  // Extract background image from BannerResponsiveImage picture element
  const bgPicture = element.querySelector('picture[class*="BannerResponsiveImage-module"]');
  const bgImg = bgPicture
    ? bgPicture.querySelector('img')
    : element.querySelector('img[class*="BannerResponsiveImage-module"]');

  // Extract logo/brand overlay image from HeroBannerShopTitleImage picture element
  const logoPicture = element.querySelector('picture[class*="HeroBannerShopTitleImage-module"]');
  const logoImg = logoPicture
    ? logoPicture.querySelector('img')
    : element.querySelector('img[class*="HeroBannerShopTitleImage"]');

  // Extract CTA text from HeroBannerShopCtas div
  const ctaElement = element.querySelector('div[class*="HeroBannerShopCtas-module"]');
  const ctaText = ctaElement ? ctaElement.textContent.trim() : '';

  // Check for a wrapping link (BannerBackgroundLinkWrapper or parent <a>)
  const wrapperLink = element.querySelector('a[class*="BannerBackgroundLinkWrapper"], a[class*="Banner"][class*="Link"]');
  const linkHref = wrapperLink ? wrapperLink.href : '';

  // Build cells matching library example structure:
  // Row 1: Background image
  // Row 2: Logo image (replaces heading in this promo variant)
  // Row 3: CTA link
  const cells = [];

  // Row 1: Background image
  if (bgImg) {
    cells.push([bgImg]);
  } else if (bgPicture) {
    cells.push([bgPicture]);
  }

  // Row 2: Logo/brand image overlay
  if (logoImg) {
    cells.push([logoImg]);
  } else if (logoPicture) {
    cells.push([logoPicture]);
  }

  // Row 3: CTA link
  if (ctaText) {
    if (linkHref) {
      // Create a proper link element with CTA text
      const link = document.createElement('a');
      link.href = linkHref;
      link.textContent = ctaText;
      cells.push([link]);
    } else {
      // Fallback: use CTA text as-is when no link wrapper found
      const p = document.createElement('p');
      p.textContent = ctaText;
      cells.push([p]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-promo', cells });
  element.replaceWith(block);
}
