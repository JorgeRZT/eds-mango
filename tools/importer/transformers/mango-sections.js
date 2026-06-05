/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Mango sections. Inserts section breaks (<hr>) between content sections.
 * Selectors from captured DOM of https://shop.mango.com/es/es/h/home.
 *
 * Template sections (from page-templates.json):
 * 1. SEO Category Navigation - div[class*="SeoBanner-module"][class*="root"]
 * 2. Hero Video Banner NEW NOW - first BannerFullHeightWrapper with Video-module
 * 3. Category Banners Row 1 - first FamilyBannerShop-module root
 * 4. Category Banners Row 2 - second FamilyBannerShop-module root
 * 5. Video Banner SUMMER LIVING - second BannerFullHeightWrapper with Video-module
 * 6. Video Banner PIJAMAS - third BannerFullHeightWrapper with Video-module
 * 7. Image Banner TOTAL WHITE - first image-only BannerFullHeightWrapper
 * 8. Image Banner LINO - second image-only BannerFullHeightWrapper
 * 9. Mango Style Club Banner - BannerFullHeightWrapper with HeroBannerShopTitleImage
 * 10. Newsletter Signup - Footer-module footer
 *
 * No sections have a style property, so no Section Metadata blocks are created.
 * Only <hr> section breaks are inserted between sections.
 *
 * Strategy: The BannerFullHeightWrapper elements are deeply nested inside wrapper
 * divs. The :nth-of-type selectors from the template won't work with querySelector
 * because each banner is isolated in its own parent chain. Instead, we use
 * querySelectorAll to find all matching elements and pick them by index, then walk
 * up to the nearest direct child of the content root to insert <hr> at the correct level.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

/**
 * Walk up from an element to find the nearest ancestor that is a direct child
 * of the given root element. Returns null if the element is not a descendant of root.
 */
function findSectionContainer(el, root) {
  let current = el;
  while (current && current.parentElement !== root) {
    current = current.parentElement;
  }
  return current;
}

export default function transform(hookName, element, payload) {
  if (hookName !== H.after) return;

  const sections = payload && payload.template && payload.template.sections;
  if (!sections || sections.length <= 1) return;

  const doc = element.ownerDocument;

  // Find the content root (HomeBrand-module wrapper or main itself)
  // In the Mango DOM: <main><div class="HomeBrand-module...">sections...</div><div>footer...</div></main>
  const contentRoot = element.querySelector('[class*="HomeBrand-module"]') || element;

  // Collect all BannerFullHeightWrapper elements in document order
  // Found in DOM: <div class="BannerFullHeightWrapper-module__vVOEJa__bannerFullHeightWrapper">
  const allBanners = Array.from(element.querySelectorAll('[class*="BannerFullHeightWrapper-module"]'));

  // Categorize banners by type (video, image-only, title-image/promo)
  const videoBanners = allBanners.filter(
    (b) => b.querySelector('[class*="Video-module"]') || b.closest('[class*="Video-module"]')
  );
  const promoBanners = allBanners.filter(
    (b) => b.querySelector('[class*="HeroBannerShopTitleImage"]') || b.closest(':has([class*="HeroBannerShopTitleImage"])')
  );
  const imageBanners = allBanners.filter(
    (b) => !videoBanners.includes(b) && !promoBanners.includes(b)
  );

  // Find FamilyBannerShop elements
  // Found in DOM: <div class="FamilyBannerShop-module__pOQkQG__root">
  const familyBanners = Array.from(element.querySelectorAll('[class*="FamilyBannerShop-module"][class*="root"]'));

  // Build ordered list of section elements based on template section definitions
  // Map each section to its matched element
  const sectionElements = [];

  // Section 1: SEO Category Navigation
  // Found in DOM: <div class="SeoBanner-module__H9iTGG__root">
  const seoBanner = element.querySelector('[class*="SeoBanner-module"][class*="root"]');
  sectionElements.push(seoBanner);

  // Section 2: Hero Video Banner (first video banner)
  sectionElements.push(videoBanners[0] || null);

  // Section 3: Category Banners Row 1 (first FamilyBannerShop)
  sectionElements.push(familyBanners[0] || null);

  // Section 4: Category Banners Row 2 (second FamilyBannerShop)
  sectionElements.push(familyBanners[1] || null);

  // Section 5: Video Banner SUMMER LIVING (second video banner)
  sectionElements.push(videoBanners[1] || null);

  // Section 6: Video Banner PIJAMAS (third video banner)
  sectionElements.push(videoBanners[2] || null);

  // Section 7: Image Banner TOTAL WHITE (first image-only banner)
  sectionElements.push(imageBanners[0] || null);

  // Section 8: Image Banner LINO (second image-only banner)
  sectionElements.push(imageBanners[1] || null);

  // Section 9: Mango Style Club Banner (promo banner with HeroBannerShopTitleImage)
  sectionElements.push(promoBanners[0] || null);

  // Section 10: Newsletter Signup
  // Found in DOM: <div class="Footer-module__KeBuga__footer" id="newsletter-footer">
  const newsletter = element.querySelector('[class*="Footer-module"][class*="footer"]');
  sectionElements.push(newsletter);

  // Process sections in reverse order to avoid position shifts
  for (let i = sectionElements.length - 1; i >= 0; i--) {
    const sectionEl = sectionElements[i];
    if (!sectionEl) continue;

    // Find the section container (direct child of content root or main)
    const container = findSectionContainer(sectionEl, contentRoot)
      || findSectionContainer(sectionEl, element);

    if (!container) continue;

    // Insert Section Metadata block if section has a style
    const section = sections[i];
    if (section && section.style) {
      const table = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      container.after(table);
    }

    // Insert <hr> before section (except the first one)
    if (i > 0) {
      const hr = doc.createElement('hr');
      container.before(hr);
    }
  }
}
