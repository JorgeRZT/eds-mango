/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-video variant.
 * Base block: hero
 * Source: https://shop.mango.com/es/es/h/home
 * Generated: 2026-06-05
 *
 * Extracts a full-width autoplay video background hero with centered text overlay.
 * Source structure:
 *   <a href="..."> (parent link wrapper)
 *     <div class="BannerFullHeightWrapper-module..."> (matched element)
 *       <div class="Video-module...videoContainer">
 *         <video src="...">
 *       </div>
 *       <div class="HeroBannerShopContent-module...">
 *         <h2 class="HeroBannerShopTitle-module...">Heading</h2>
 *         <div class="HeroBannerShopCtas-module...">CTA text</div>
 *       </div>
 *     </div>
 *   </a>
 *
 * Target table structure (from block library):
 *   Row 1: Video URL (background media)
 *   Row 2: H2 heading
 *   Row 3: CTA link (text + href from parent <a>)
 */
export default function parse(element, { document }) {
  // Extract video URL from the video element within the video container
  const video = element.querySelector('video');
  const videoSrc = video ? (video.getAttribute('src') || video.getAttribute('data-src')) : null;

  // Extract heading text from HeroBannerShopTitle
  const heading = element.querySelector('h2[class*="HeroBannerShopTitle"], h2[class*="heroBannerShopTitle"], h2');

  // Extract CTA text from HeroBannerShopCtas
  const ctaTextEl = element.querySelector('[class*="HeroBannerShopCtas"][class*="heroBannerShopCtaText"], [class*="HeroBannerShopCtas-module"]');
  const ctaText = ctaTextEl ? ctaTextEl.textContent.trim() : '';

  // Get the destination URL from the parent <a> wrapper
  const parentLink = element.closest('a');
  const linkHref = parentLink ? parentLink.getAttribute('href') : '';

  // Build Row 1: Video URL as a link element (so import treats it as media)
  const videoLink = document.createElement('a');
  videoLink.href = videoSrc || '';
  videoLink.textContent = videoSrc || '';

  // Build Row 2: Heading (preserve as h2 element)
  const h2 = document.createElement('h2');
  h2.textContent = heading ? heading.textContent.trim() : '';

  // Build Row 3: CTA as a link with text and href
  const ctaLink = document.createElement('a');
  ctaLink.href = linkHref;
  ctaLink.textContent = ctaText || 'Descubre más';

  // Assemble cells matching block library structure
  const cells = [
    [videoLink],
    [h2],
    [ctaLink],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  element.replaceWith(block);
}
