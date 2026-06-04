/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-branded variant.
 * Base block: hero
 * Source: https://shop.mango.com/es/es/h/home
 * Generated: 2026-06-04
 * Validation: manual verification passed (site WAF blocks headless browsers)
 *
 * Structure (from block library):
 *   Row 1: Background image
 *   Row 2: Brand logo image
 *   Row 3: CTA link
 *
 * Source DOM structure (element is the wrapping <a> link):
 *   - Element: a.BannerBackgroundLinkWrapper-module__*__link (href, title always available)
 *   - Child: div.BannerFullHeightWrapper-module__*__bannerFullHeightWrapper
 *     - Background image: picture.BannerResponsiveImage-module__*__picture > img
 *     - Content wrapper: div.HeroBannerShopContent-module__*__heroBannerTextCenterWrapper
 *       - Logo image: picture.HeroBannerShopTitleImage-module__*__picture > img (alt="Mango Style Club")
 *       - CTA text: div.HeroBannerShopCtas-module__*__heroBannerShopCtaText
 *
 * Note: Content inside the banner may be lazily loaded. Parser handles both
 * loaded (full extraction) and unloaded (fallback from link attributes) states.
 */
export default function parse(element, { document }) {
  // The element is the <a> wrapper which always has href and title
  const ctaHref = element.getAttribute('href') || '';
  const linkTitle = element.getAttribute('title') || '';

  // Try to extract content from inside the banner (may be lazily loaded)
  const wrapper = element.querySelector('div[class*="BannerFullHeightWrapper-module"]');

  // Extract background image
  const bgPicture = wrapper
    ? wrapper.querySelector(':scope > picture[class*="BannerResponsiveImage-module"]')
    : null;
  const bgImg = bgPicture ? bgPicture.querySelector('img') : null;

  // Extract the brand logo image
  const logoPicture = wrapper
    ? wrapper.querySelector('picture[class*="HeroBannerShopTitleImage-module"]')
    : null;
  const logoImg = logoPicture ? logoPicture.querySelector('img') : null;

  // Extract CTA text from the content div
  const ctaTextEl = wrapper
    ? wrapper.querySelector('[class*="HeroBannerShopCtas-module"]')
    : null;
  const ctaText = ctaTextEl ? ctaTextEl.textContent.trim() : '';

  // Build cells matching the block library table structure:
  // Row 1: background image
  // Row 2: brand logo image
  // Row 3: CTA link
  const cells = [];

  // Row 1: Background image
  if (bgImg) {
    cells.push([bgImg]);
  } else if (bgPicture) {
    cells.push([bgPicture]);
  }

  // Row 2: Brand logo image (use logoImg or create placeholder from title)
  if (logoImg) {
    cells.push([logoImg]);
  } else if (linkTitle) {
    // Fallback: create an image placeholder from the link title
    const placeholderImg = document.createElement('img');
    placeholderImg.alt = linkTitle.replace(/^Descubrir el Club\s*/i, '').trim() || linkTitle;
    placeholderImg.src = '';
    cells.push([placeholderImg]);
  }

  // Row 3: CTA link
  if (ctaHref) {
    const ctaLink = document.createElement('a');
    ctaLink.href = ctaHref;
    ctaLink.textContent = ctaText || linkTitle.split(' ').slice(0, 3).join(' ') || 'Discover';
    cells.push([ctaLink]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-branded', cells });
  element.replaceWith(block);
}
