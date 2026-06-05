/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Mango cleanup. Selectors from captured DOM of https://shop.mango.com/es/es/h/home.
 *
 * Removes non-authorable content:
 * - Schema.org meta tags (itemprop="url", itemprop="name")
 * - Video overlay UI elements (play/pause overlays)
 * - Video player controls (ShortControls buttons)
 * - SEO banner horizontal scroll navigation button
 * - Empty video track elements (captions placeholder)
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove video player controls that would interfere with block parsing
    // Found in DOM: <div class="VideoOverlay-module__aeDjea__overlay"></div>
    // Found in DOM: <div class="ShortControls-module__AqX6Ua__buttonWrapper">
    WebImporter.DOMUtils.remove(element, [
      '[class*="VideoOverlay-module"]',
      '[class*="ShortControls-module"]',
    ]);
  }
  if (hookName === H.after) {
    // Remove schema.org meta tags (non-authorable structured data)
    // Found in DOM: <meta itemprop="url" content="https://shop.mango.com">
    // Found in DOM: <meta itemprop="name" content="Mango Shop">
    WebImporter.DOMUtils.remove(element, [
      'meta[itemprop]',
    ]);

    // Remove SEO banner scroll navigation button (UI control, not authorable)
    // Found in DOM: <button class="...SeoBanner-module__H9iTGG__button SeoBanner-module__H9iTGG__buttonNext...">
    WebImporter.DOMUtils.remove(element, [
      'button[class*="SeoBanner-module"][class*="button"]',
    ]);

    // Remove empty video track elements (no actual captions content)
    // Found in DOM: <track kind="captions">
    WebImporter.DOMUtils.remove(element, [
      'track',
    ]);

    // Remove itemscope/itemtype attributes from the root wrapper (schema.org markup)
    // Found in DOM: <div class="HomeBrand-module__6dA2bq__root" itemtype="https://schema.org/WebSite" itemscope="">
    const itemscopeEl = element.querySelector('[itemscope]');
    if (itemscopeEl) {
      itemscopeEl.removeAttribute('itemscope');
      itemscopeEl.removeAttribute('itemtype');
    }
  }
}
