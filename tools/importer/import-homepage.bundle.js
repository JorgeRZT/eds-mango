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

  // tools/importer/parsers/hero-campaign.js
  function parse(element, { document }) {
    const video = element.querySelector("video");
    const picture = element.querySelector("picture");
    const img = element.querySelector("img");
    const heading = element.querySelector("h2, h1");
    const ctaTextEl = element.querySelector('[class*="HeroBannerShopCtas-module"], [class*="heroBannerShopCtaText"]');
    const parentLink = element.parentElement && element.parentElement.tagName === "A" ? element.parentElement : element.querySelector("a");
    const cells = [];
    if (video) {
      const posterUrl = video.getAttribute("poster") || "";
      if (posterUrl) {
        const posterImg = document.createElement("img");
        posterImg.src = posterUrl;
        posterImg.alt = "";
        cells.push([posterImg]);
      }
    } else if (picture) {
      cells.push([picture]);
    } else if (img) {
      cells.push([img]);
    }
    if (heading) {
      const h = document.createElement("h1");
      h.textContent = heading.textContent.trim();
      cells.push([h]);
    }
    const ctaText = ctaTextEl ? ctaTextEl.textContent.trim() : "";
    const ctaHref = parentLink ? parentLink.getAttribute("href") || "" : "";
    if (ctaText && ctaHref) {
      const ctaLink = document.createElement("a");
      ctaLink.href = ctaHref;
      ctaLink.textContent = ctaText;
      cells.push([ctaLink]);
    } else if (ctaText) {
      const p = document.createElement("p");
      p.textContent = ctaText;
      cells.push([p]);
    } else if (ctaHref) {
      const ctaLink = document.createElement("a");
      ctaLink.href = ctaHref;
      ctaLink.textContent = ctaHref;
      cells.push([ctaLink]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-campaign", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-branded.js
  function parse2(element, { document }) {
    const ctaHref = element.getAttribute("href") || "";
    const linkTitle = element.getAttribute("title") || "";
    const wrapper = element.querySelector('div[class*="BannerFullHeightWrapper-module"]');
    const bgPicture = wrapper ? wrapper.querySelector(':scope > picture[class*="BannerResponsiveImage-module"]') : null;
    const bgImg = bgPicture ? bgPicture.querySelector("img") : null;
    const logoPicture = wrapper ? wrapper.querySelector('picture[class*="HeroBannerShopTitleImage-module"]') : null;
    const logoImg = logoPicture ? logoPicture.querySelector("img") : null;
    const ctaTextEl = wrapper ? wrapper.querySelector('[class*="HeroBannerShopCtas-module"]') : null;
    const ctaText = ctaTextEl ? ctaTextEl.textContent.trim() : "";
    const cells = [];
    if (bgImg) {
      cells.push([bgImg]);
    } else if (bgPicture) {
      cells.push([bgPicture]);
    }
    if (logoImg) {
      cells.push([logoImg]);
    } else if (linkTitle) {
      const placeholderImg = document.createElement("img");
      placeholderImg.alt = linkTitle.replace(/^Descubrir el Club\s*/i, "").trim() || linkTitle;
      placeholderImg.src = "";
      cells.push([placeholderImg]);
    }
    if (ctaHref) {
      const ctaLink = document.createElement("a");
      ctaLink.href = ctaHref;
      ctaLink.textContent = ctaText || linkTitle.split(" ").slice(0, 3).join(" ") || "Discover";
      cells.push([ctaLink]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-branded", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-category.js
  function parse3(element, { document }) {
    const wrappers = element.querySelectorAll(':scope > div[class*="familyBannerWrapper"]');
    const columnCells = [];
    wrappers.forEach((wrapper) => {
      const cellContent = [];
      const link = wrapper.querySelector('a[class*="link"], a[href]');
      if (!link) return;
      const href = link.getAttribute("href") || "";
      const picture = link.querySelector("picture");
      const img = link.querySelector("img");
      if (picture) {
        cellContent.push(picture);
      } else if (img) {
        cellContent.push(img);
      }
      const heading = link.querySelector('h2[class*="title"], h2');
      const categoryName = heading ? heading.textContent.trim() : link.textContent.trim();
      if (categoryName && href) {
        const categoryLink = document.createElement("a");
        categoryLink.href = href;
        categoryLink.textContent = categoryName;
        cellContent.push(categoryLink);
      }
      if (cellContent.length > 0) {
        columnCells.push(cellContent);
      }
    });
    const cells = [];
    if (columnCells.length > 0) {
      cells.push(columnCells);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-category", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/mango-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, ['[class*="VideoOverlay-module"]']);
      WebImporter.DOMUtils.remove(element, ['[class*="ShortControls-module"]']);
      WebImporter.DOMUtils.remove(element, ['button[class*="SeoBanner-module"][class*="button"]']);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["meta[itemprop]"]);
      const schemaEls = element.querySelectorAll("[itemscope], [itemtype]");
      schemaEls.forEach((el) => {
        el.removeAttribute("itemscope");
        el.removeAttribute("itemtype");
      });
      const itempropEls = element.querySelectorAll("[itemprop]");
      itempropEls.forEach((el) => {
        el.removeAttribute("itemprop");
      });
    }
  }

  // tools/importer/transformers/mango-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function findTopLevelAncestor(el, root) {
    if (!el || !root) return null;
    let current = el;
    while (current && current.parentElement && current.parentElement !== root) {
      current = current.parentElement;
    }
    if (current && current.parentElement === root) return current;
    return null;
  }
  function parseSelector(selector) {
    const nthMatch = selector.match(/:nth-of-type\((\d+)\)$/);
    if (nthMatch) {
      const baseSelector = selector.replace(/:nth-of-type\(\d+\)$/, "");
      return { baseSelector, nthIndex: parseInt(nthMatch[1], 10) - 1 };
    }
    return { baseSelector: selector, nthIndex: -1 };
  }
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const { document } = payload;
      const contentRoot = element.querySelector('[class*="HomeBrand-module"]') || element;
      const selectorCache = {};
      const sectionElements = [];
      for (const section of sections) {
        const { baseSelector, nthIndex } = parseSelector(section.selector);
        if (!selectorCache[baseSelector]) {
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
          const topEl = findTopLevelAncestor(sectionEl, contentRoot);
          sectionElements.push({ section, topEl: topEl || sectionEl });
        } else {
          sectionElements.push({ section, topEl: null });
        }
      }
      for (let i = sectionElements.length - 1; i >= 1; i--) {
        const { section, topEl } = sectionElements[i];
        if (!topEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          topEl.before(sectionMetadata);
        }
        const hr = document.createElement("hr");
        topEl.before(hr);
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
    "hero-campaign": parse,
    "hero-branded": parse2,
    "columns-category": parse3
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Mango homepage with hero banners, product categories, and promotional content",
    urls: ["https://shop.mango.com/es/es/h/home"],
    blocks: [
      {
        name: "hero-campaign",
        instances: ['div[class*="BannerFullHeightWrapper-module"][class*="bannerFullHeightWrapper"]:has([class*="TextStyles-module"][class*="textShadow"])']
      },
      {
        name: "hero-branded",
        instances: ['a[href*="mango-style-club"][class*="BannerBackgroundLinkWrapper-module"]']
      },
      {
        name: "columns-category",
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
        defaultContent: ['div[class*="SeoBanner-module"][class*="root"] h1', 'div[class*="SeoBanner-module"][class*="root"] ul']
      },
      {
        id: "section-2",
        name: "Hero New Now",
        selector: 'div[class*="BannerFullHeightWrapper-module"][class*="bannerFullHeightWrapper"]:nth-of-type(1)',
        style: null,
        blocks: ["hero-campaign"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Category Columns 1",
        selector: 'div[class*="FamilyBannerShop-module"][class*="root"]:nth-of-type(1)',
        style: null,
        blocks: ["columns-category"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Category Columns 2",
        selector: 'div[class*="FamilyBannerShop-module"][class*="root"]:nth-of-type(2)',
        style: null,
        blocks: ["columns-category"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Hero Summer Living",
        selector: 'div[class*="BannerFullHeightWrapper-module"][class*="bannerFullHeightWrapper"]:nth-of-type(2)',
        style: null,
        blocks: ["hero-campaign"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Hero Pijamas",
        selector: 'div[class*="BannerFullHeightWrapper-module"][class*="bannerFullHeightWrapper"]:nth-of-type(3)',
        style: null,
        blocks: ["hero-campaign"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Hero Total White",
        selector: 'div[class*="BannerFullHeightWrapper-module"][class*="bannerFullHeightWrapper"]:nth-of-type(4)',
        style: null,
        blocks: ["hero-campaign"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Hero Lino",
        selector: 'div[class*="BannerFullHeightWrapper-module"][class*="bannerFullHeightWrapper"]:nth-of-type(5)',
        style: null,
        blocks: ["hero-campaign"],
        defaultContent: []
      },
      {
        id: "section-9",
        name: "Hero Mango Style Club",
        selector: 'div[class*="BannerFullHeightWrapper-module"][class*="bannerFullHeightWrapper"]:nth-of-type(6)',
        style: null,
        blocks: ["hero-branded"],
        defaultContent: []
      },
      {
        id: "section-10",
        name: "Newsletter Subscription",
        selector: 'div[class*="Footer-module"][class*="footer"]',
        style: null,
        blocks: [],
        defaultContent: ['div[class*="Footer-module"] [class*="title"]', 'div[class*="Footer-module"] form']
      }
    ]
  };
  var transformers = [
    transform,
    transform3,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
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
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
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
    console.log(`Found ${pageBlocks.length} block instances on page`);
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
        } else {
          console.warn(`No parser found for block: ${block.name}`);
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
