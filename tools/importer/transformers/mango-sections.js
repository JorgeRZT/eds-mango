/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Mango homepage section breaks.
 * Inserts <hr> between sections based on template section definitions.
 * Selectors validated against migration-work/cleaned.html.
 *
 * Section order in DOM:
 *   1. div[class*="SeoBanner-module"][class*="root"]
 *   2. div[class*="BannerFullHeightWrapper-module"][class*="bannerFullHeightWrapper"] (1st)
 *   3. div[class*="FamilyBannerShop-module"][class*="root"] (1st)
 *   4. div[class*="FamilyBannerShop-module"][class*="root"] (2nd)
 *   5. div[class*="BannerFullHeightWrapper-module"][class*="bannerFullHeightWrapper"] (2nd)
 *   6. div[class*="BannerFullHeightWrapper-module"][class*="bannerFullHeightWrapper"] (3rd)
 *   7. div[class*="BannerFullHeightWrapper-module"][class*="bannerFullHeightWrapper"] (4th)
 *   8. div[class*="BannerFullHeightWrapper-module"][class*="bannerFullHeightWrapper"] (5th)
 *   9. div[class*="BannerFullHeightWrapper-module"][class*="bannerFullHeightWrapper"] (6th)
 *  10. div[class*="Footer-module"][class*="footer"]
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

/**
 * Finds the closest ancestor that is a direct child of the given root element.
 * Walks up the DOM tree from el until the parent is root.
 * Returns null if el is not a descendant of root.
 */
function findTopLevelAncestor(el, root) {
  if (!el || !root) return null;
  let current = el;
  while (current && current.parentElement && current.parentElement !== root) {
    current = current.parentElement;
  }
  if (current && current.parentElement === root) return current;
  return null;
}

/**
 * Resolves the base selector (without :nth-of-type) from a template section selector.
 * Returns { baseSelector, nthIndex } where nthIndex is 0-based or -1 if no nth-of-type.
 */
function parseSelector(selector) {
  const nthMatch = selector.match(/:nth-of-type\((\d+)\)$/);
  if (nthMatch) {
    const baseSelector = selector.replace(/:nth-of-type\(\d+\)$/, '');
    return { baseSelector, nthIndex: parseInt(nthMatch[1], 10) - 1 };
  }
  return { baseSelector: selector, nthIndex: -1 };
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const { document } = payload;

    // Find the content root - the main content wrapper
    // In cleaned.html: <main id="page-content-layer"><div class="HomeBrand-module__root">
    const contentRoot = element.querySelector('[class*="HomeBrand-module"]') || element;

    // Build a map of base selectors to all matching elements (in DOM order)
    const selectorCache = {};

    // Resolve each section to its top-level DOM element
    const sectionElements = [];

    for (const section of sections) {
      const { baseSelector, nthIndex } = parseSelector(section.selector);

      // Query and cache results for this base selector
      if (!selectorCache[baseSelector]) {
        // Use attribute selectors that work regardless of CSS module hash
        // Convert class*= patterns from template selectors to querySelectorAll-compatible form
        try {
          selectorCache[baseSelector] = Array.from(element.querySelectorAll(baseSelector));
        } catch (e) {
          selectorCache[baseSelector] = [];
        }
      }

      const matches = selectorCache[baseSelector];
      let sectionEl = null;

      if (nthIndex >= 0 && matches.length > nthIndex) {
        sectionEl = matches[nthIndex];
      } else if (nthIndex === -1 && matches.length > 0) {
        sectionEl = matches[0];
      }

      if (sectionEl) {
        // Walk up to find the top-level container within contentRoot
        const topEl = findTopLevelAncestor(sectionEl, contentRoot);
        sectionElements.push({ section, topEl: topEl || sectionEl });
      } else {
        sectionElements.push({ section, topEl: null });
      }
    }

    // Insert <hr> before each section (except the first) in reverse order
    // Reverse order prevents position shifts from affecting later insertions
    for (let i = sectionElements.length - 1; i >= 1; i--) {
      const { section, topEl } = sectionElements[i];
      if (!topEl) continue;

      // Insert Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        topEl.before(sectionMetadata);
      }

      // Insert <hr> before this section's top-level element
      const hr = document.createElement('hr');
      topEl.before(hr);
    }
  }
}
