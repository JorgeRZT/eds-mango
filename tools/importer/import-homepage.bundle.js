/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-video.js
  function parse(element, { document }) {
    const video = element.querySelector("video");
    const videoSrc = video ? video.getAttribute("src") || video.getAttribute("data-src") : null;
    const heading = element.querySelector('h2[class*="HeroBannerShopTitle"], h2[class*="heroBannerShopTitle"], h2');
    const ctaTextEl = element.querySelector('[class*="HeroBannerShopCtas"][class*="heroBannerShopCtaText"], [class*="HeroBannerShopCtas-module"]');
    const ctaText = ctaTextEl ? ctaTextEl.textContent.trim() : "";
    const parentLink = element.closest("a");
    const linkHref = parentLink ? parentLink.getAttribute("href") : "";
    const videoLink = document.createElement("a");
    videoLink.href = videoSrc || "";
    videoLink.textContent = videoSrc || "";
    const h2 = document.createElement("h2");
    h2.textContent = heading ? heading.textContent.trim() : "";
    const ctaLink = document.createElement("a");
    ctaLink.href = linkHref;
    ctaLink.textContent = ctaText || "Descubre m\xE1s";
    const cells = [
      [videoLink],
      [h2],
      [ctaLink]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse2(element, { document }) {
    const picture = element.querySelector('picture[class*="BannerResponsiveImage-module"], picture');
    const img = element.querySelector('img[class*="BannerResponsiveImage-module"], img');
    const heading = element.querySelector(
      'h2[class*="HeroBannerShopTitle-module"], h2[class*="heroBannerShopTitle"], h1, h2'
    );
    const ctaElement = element.querySelector(
      'div[class*="HeroBannerShopCtas-module"], div[class*="heroBannerShopCtaText"], [class*="HeroBannerShopCta"]'
    );
    const wrapperLink = element.querySelector(
      'a[class*="BannerBackgroundLink"], a[class*="bannerBackgroundLink"], a[href]'
    );
    const cells = [];
    if (picture) {
      cells.push([picture]);
    } else if (img) {
      cells.push([img]);
    }
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      cells.push([h2]);
    }
    if (ctaElement) {
      const ctaText = ctaElement.textContent.trim();
      if (wrapperLink && wrapperLink.href) {
        const link = document.createElement("a");
        link.href = wrapperLink.href;
        link.textContent = ctaText;
        cells.push([link]);
      } else {
        const p = document.createElement("p");
        p.textContent = ctaText;
        cells.push([p]);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-promo.js
  function parse3(element, { document }) {
    const bgPicture = element.querySelector('picture[class*="BannerResponsiveImage-module"]');
    const bgImg = bgPicture ? bgPicture.querySelector("img") : element.querySelector('img[class*="BannerResponsiveImage-module"]');
    const logoPicture = element.querySelector('picture[class*="HeroBannerShopTitleImage-module"]');
    const logoImg = logoPicture ? logoPicture.querySelector("img") : element.querySelector('img[class*="HeroBannerShopTitleImage"]');
    const ctaElement = element.querySelector('div[class*="HeroBannerShopCtas-module"]');
    const ctaText = ctaElement ? ctaElement.textContent.trim() : "";
    const wrapperLink = element.querySelector('a[class*="BannerBackgroundLinkWrapper"], a[class*="Banner"][class*="Link"]');
    const linkHref = wrapperLink ? wrapperLink.href : "";
    const cells = [];
    if (bgImg) {
      cells.push([bgImg]);
    } else if (bgPicture) {
      cells.push([bgPicture]);
    }
    if (logoImg) {
      cells.push([logoImg]);
    } else if (logoPicture) {
      cells.push([logoPicture]);
    }
    if (ctaText) {
      if (linkHref) {
        const link = document.createElement("a");
        link.href = linkHref;
        link.textContent = ctaText;
        cells.push([link]);
      } else {
        const p = document.createElement("p");
        p.textContent = ctaText;
        cells.push([p]);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-banner.js
  function parse4(element, { document }) {
    let columns = Array.from(element.querySelectorAll(':scope > div[class*="familyBannerWrapper"]'));
    if (columns.length === 0) {
      columns = Array.from(element.querySelectorAll(":scope > div"));
    }
    const imageRow = [];
    const headingRow = [];
    const linkRow = [];
    columns.forEach((col) => {
      const link = col.querySelector("a[href]");
      const img = col.querySelector("img");
      const heading = col.querySelector("h2, h3");
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.getAttribute("src") || "";
        newImg.alt = heading ? heading.textContent.trim() : img.getAttribute("alt") || "";
        imageRow.push(newImg);
      } else {
        imageRow.push("");
      }
      if (heading) {
        const strong = document.createElement("strong");
        strong.textContent = heading.textContent.trim();
        headingRow.push(strong);
      } else {
        headingRow.push("");
      }
      if (link) {
        const newLink = document.createElement("a");
        newLink.href = link.getAttribute("href");
        newLink.textContent = heading ? heading.textContent.trim() : link.getAttribute("title") || "Ver todo";
        linkRow.push(newLink);
      } else {
        linkRow.push("");
      }
    });
    const cells = [];
    if (imageRow.length > 0) {
      cells.push(imageRow);
    }
    if (headingRow.length > 0) {
      cells.push(headingRow);
    }
    if (linkRow.length > 0) {
      cells.push(linkRow);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/mango-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        '[class*="VideoOverlay-module"]',
        '[class*="ShortControls-module"]'
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "meta[itemprop]"
      ]);
      WebImporter.DOMUtils.remove(element, [
        'button[class*="SeoBanner-module"][class*="button"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        "track"
      ]);
      const itemscopeEl = element.querySelector("[itemscope]");
      if (itemscopeEl) {
        itemscopeEl.removeAttribute("itemscope");
        itemscopeEl.removeAttribute("itemtype");
      }
    }
  }

  // tools/importer/transformers/mango-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function findSectionContainer(el, root) {
    let current = el;
    while (current && current.parentElement !== root) {
      current = current.parentElement;
    }
    return current;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== H2.after) return;
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length <= 1) return;
    const doc = element.ownerDocument;
    const contentRoot = element.querySelector('[class*="HomeBrand-module"]') || element;
    const allBanners = Array.from(element.querySelectorAll('[class*="BannerFullHeightWrapper-module"]'));
    const videoBanners = allBanners.filter(
      (b) => b.querySelector('[class*="Video-module"]') || b.closest('[class*="Video-module"]')
    );
    const promoBanners = allBanners.filter(
      (b) => b.querySelector('[class*="HeroBannerShopTitleImage"]') || b.closest(':has([class*="HeroBannerShopTitleImage"])')
    );
    const imageBanners = allBanners.filter(
      (b) => !videoBanners.includes(b) && !promoBanners.includes(b)
    );
    const familyBanners = Array.from(element.querySelectorAll('[class*="FamilyBannerShop-module"][class*="root"]'));
    const sectionElements = [];
    const seoBanner = element.querySelector('[class*="SeoBanner-module"][class*="root"]');
    sectionElements.push(seoBanner);
    sectionElements.push(videoBanners[0] || null);
    sectionElements.push(familyBanners[0] || null);
    sectionElements.push(familyBanners[1] || null);
    sectionElements.push(videoBanners[1] || null);
    sectionElements.push(videoBanners[2] || null);
    sectionElements.push(imageBanners[0] || null);
    sectionElements.push(imageBanners[1] || null);
    sectionElements.push(promoBanners[0] || null);
    const newsletter = element.querySelector('[class*="Footer-module"][class*="footer"]');
    sectionElements.push(newsletter);
    for (let i = sectionElements.length - 1; i >= 0; i--) {
      const sectionEl = sectionElements[i];
      if (!sectionEl) continue;
      const container = findSectionContainer(sectionEl, contentRoot) || findSectionContainer(sectionEl, element);
      if (!container) continue;
      const section = sections[i];
      if (section && section.style) {
        const table = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        container.after(table);
      }
      if (i > 0) {
        const hr = doc.createElement("hr");
        container.before(hr);
      }
    }
  }

  // tools/importer/transformers/mango-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  var LINKED_DM_INLINE_WRAPPER_TAGS = /* @__PURE__ */ new Set(["PICTURE"]);
  var LINKED_DM_WRAPPER_SIBLING_TAGS = /* @__PURE__ */ new Set(["SOURCE"]);
  function findLinkedDmCarrier(img) {
    if (!img || !img.parentElement) return null;
    let node = img;
    let parent = img.parentElement;
    while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
      let foundNode = false;
      for (const child of parent.children) {
        if (child === node) {
          foundNode = true;
        } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
          return null;
        }
      }
      if (!foundNode) return null;
      node = parent;
      parent = parent.parentElement;
    }
    if (!parent || parent.tagName !== "A") return null;
    if (parent.children.length !== 1 || parent.children[0] !== node) return null;
    if (parent.textContent.trim() !== "") return null;
    return parent;
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform3(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const linkedAnchor = findLinkedDmCarrier(img);
      if (linkedAnchor) {
        linkedAnchor.setAttribute("title", src);
        linkedAnchor.textContent = altToLinkText(alt);
        return;
      }
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-video": parse,
    "hero-banner": parse2,
    "hero-promo": parse3,
    "columns-banner": parse4
  };
  var transformers = [
    transform,
    transform2,
    transform3
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Mango online shop homepage with hero banners, product categories, and promotional content",
    urls: ["https://shop.mango.com/es/es/h/home"],
    blocks: [
      {
        name: "hero-video",
        instances: ['div[class*="BannerFullHeightWrapper-module"]:has([class*="Video-module"][class*="videoContainer"])']
      },
      {
        name: "hero-banner",
        instances: ['div[class*="BannerFullHeightWrapper-module"]:has(picture):not(:has(video)):not(:has([class*="HeroBannerShopTitleImage"]))']
      },
      {
        name: "hero-promo",
        instances: ['div[class*="BannerFullHeightWrapper-module"]:has([class*="HeroBannerShopTitleImage"])']
      },
      {
        name: "columns-banner",
        instances: ['div[class*="FamilyBannerShop-module"][class*="root"]']
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "SEO Category Navigation",
        selector: 'div[class*="SeoBanner-module"][class*="root"]',
        style: null,
        blocks: [],
        defaultContent: ['h1[class*="SeoBanner-module"][class*="title"]', 'ul[class*="SeoBanner-module"][class*="linkList"]']
      },
      {
        id: "section-2",
        name: "Hero Video Banner - NEW NOW",
        selector: 'div[class*="BannerFullHeightWrapper-module"]:has([class*="Video-module"]):nth-of-type(1)',
        style: null,
        blocks: ["hero-video"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Category Banners Row 1",
        selector: 'div[class*="FamilyBannerShop-module"][class*="root"]:nth-of-type(1)',
        style: null,
        blocks: ["columns-banner"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Category Banners Row 2",
        selector: 'div[class*="FamilyBannerShop-module"][class*="root"]:nth-of-type(2)',
        style: null,
        blocks: ["columns-banner"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Video Banner - SUMMER LIVING",
        selector: 'div[class*="BannerFullHeightWrapper-module"]:has([class*="Video-module"]):nth-of-type(2)',
        style: null,
        blocks: ["hero-video"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Video Banner - PIJAMAS",
        selector: 'div[class*="BannerFullHeightWrapper-module"]:has([class*="Video-module"]):nth-of-type(3)',
        style: null,
        blocks: ["hero-video"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Image Banner - TOTAL WHITE",
        selector: 'div[class*="BannerFullHeightWrapper-module"]:has(picture):not(:has(video)):not(:has([class*="HeroBannerShopTitleImage"])):nth-of-type(1)',
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Image Banner - LINO",
        selector: 'div[class*="BannerFullHeightWrapper-module"]:has(picture):not(:has(video)):not(:has([class*="HeroBannerShopTitleImage"])):nth-of-type(2)',
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-9",
        name: "Mango Style Club Banner",
        selector: 'div[class*="BannerFullHeightWrapper-module"]:has([class*="HeroBannerShopTitleImage"])',
        style: null,
        blocks: ["hero-promo"],
        defaultContent: []
      },
      {
        id: "section-10",
        name: "Newsletter Signup",
        selector: 'div[class*="Footer-module"][class*="footer"]',
        style: null,
        blocks: [],
        defaultContent: ["h2", 'form[class*="Form-module"]']
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
