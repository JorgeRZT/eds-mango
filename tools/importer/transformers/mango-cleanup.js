/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Mango homepage cleanup.
 * Removes non-authorable UI elements from the DOM.
 * Selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove video overlay divs (visual overlay on hero videos, not authorable)
    // Found in cleaned.html: <div class="VideoOverlay-module__aeDjea__overlay">
    WebImporter.DOMUtils.remove(element, ['[class*="VideoOverlay-module"]']);

    // Remove video play/pause controls (interactive UI, not authorable)
    // Found in cleaned.html: <div class="ShortControls-module__AqX6Ua__buttonWrapper">
    WebImporter.DOMUtils.remove(element, ['[class*="ShortControls-module"]']);

    // Remove SEO banner scroll navigation button (UI control, not authorable)
    // Found in cleaned.html: <button class="...SeoBanner-module__H9iTGG__button SeoBanner-module__H9iTGG__buttonNext...">
    WebImporter.DOMUtils.remove(element, ['button[class*="SeoBanner-module"][class*="button"]']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove schema.org meta tags (not authorable content)
    // Found in cleaned.html: <meta itemprop="url" content="https://shop.mango.com">
    // Found in cleaned.html: <meta itemprop="name" content="Mango Shop">
    WebImporter.DOMUtils.remove(element, ['meta[itemprop]']);

    // Remove itemscope/itemtype attributes from wrapper div (schema.org markup)
    // Found in cleaned.html: <div class="HomeBrand-module__6dA2bq__root" itemtype="https://schema.org/WebSite" itemscope="">
    const schemaEls = element.querySelectorAll('[itemscope], [itemtype]');
    schemaEls.forEach((el) => {
      el.removeAttribute('itemscope');
      el.removeAttribute('itemtype');
    });

    // Remove itemprop attributes (schema.org, not authorable)
    const itempropEls = element.querySelectorAll('[itemprop]');
    itempropEls.forEach((el) => {
      el.removeAttribute('itemprop');
    });
  }
}
