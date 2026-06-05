/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroVideoParser from './parsers/hero-video.js';
import heroBannerParser from './parsers/hero-banner.js';
import heroPromoParser from './parsers/hero-promo.js';
import columnsBannerParser from './parsers/columns-banner.js';

// TRANSFORMER IMPORTS
import mangoCleanupTransformer from './transformers/mango-cleanup.js';
import mangoSectionsTransformer from './transformers/mango-sections.js';
import mangoDmImagesTransformer from './transformers/mango-dm-images.js';

// PARSER REGISTRY
const parsers = {
  'hero-video': heroVideoParser,
  'hero-banner': heroBannerParser,
  'hero-promo': heroPromoParser,
  'columns-banner': columnsBannerParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  mangoCleanupTransformer,
  mangoSectionsTransformer,
  mangoDmImagesTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Mango online shop homepage with hero banners, product categories, and promotional content',
  urls: ['https://shop.mango.com/es/es/h/home'],
  blocks: [
    {
      name: 'hero-video',
      instances: ['div[class*="BannerFullHeightWrapper-module"]:has([class*="Video-module"][class*="videoContainer"])'],
    },
    {
      name: 'hero-banner',
      instances: ['div[class*="BannerFullHeightWrapper-module"]:has(picture):not(:has(video)):not(:has([class*="HeroBannerShopTitleImage"]))'],
    },
    {
      name: 'hero-promo',
      instances: ['div[class*="BannerFullHeightWrapper-module"]:has([class*="HeroBannerShopTitleImage"])'],
    },
    {
      name: 'columns-banner',
      instances: ['div[class*="FamilyBannerShop-module"][class*="root"]'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'SEO Category Navigation',
      selector: 'div[class*="SeoBanner-module"][class*="root"]',
      style: null,
      blocks: [],
      defaultContent: ['h1[class*="SeoBanner-module"][class*="title"]', 'ul[class*="SeoBanner-module"][class*="linkList"]'],
    },
    {
      id: 'section-2',
      name: 'Hero Video Banner - NEW NOW',
      selector: 'div[class*="BannerFullHeightWrapper-module"]:has([class*="Video-module"]):nth-of-type(1)',
      style: null,
      blocks: ['hero-video'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Category Banners Row 1',
      selector: 'div[class*="FamilyBannerShop-module"][class*="root"]:nth-of-type(1)',
      style: null,
      blocks: ['columns-banner'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Category Banners Row 2',
      selector: 'div[class*="FamilyBannerShop-module"][class*="root"]:nth-of-type(2)',
      style: null,
      blocks: ['columns-banner'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Video Banner - SUMMER LIVING',
      selector: 'div[class*="BannerFullHeightWrapper-module"]:has([class*="Video-module"]):nth-of-type(2)',
      style: null,
      blocks: ['hero-video'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Video Banner - PIJAMAS',
      selector: 'div[class*="BannerFullHeightWrapper-module"]:has([class*="Video-module"]):nth-of-type(3)',
      style: null,
      blocks: ['hero-video'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Image Banner - TOTAL WHITE',
      selector: 'div[class*="BannerFullHeightWrapper-module"]:has(picture):not(:has(video)):not(:has([class*="HeroBannerShopTitleImage"])):nth-of-type(1)',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'Image Banner - LINO',
      selector: 'div[class*="BannerFullHeightWrapper-module"]:has(picture):not(:has(video)):not(:has([class*="HeroBannerShopTitleImage"])):nth-of-type(2)',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-9',
      name: 'Mango Style Club Banner',
      selector: 'div[class*="BannerFullHeightWrapper-module"]:has([class*="HeroBannerShopTitleImage"])',
      style: null,
      blocks: ['hero-promo'],
      defaultContent: [],
    },
    {
      id: 'section-10',
      name: 'Newsletter Signup',
      selector: 'div[class*="Footer-module"][class*="footer"]',
      style: null,
      blocks: [],
      defaultContent: ['h2', 'form[class*="Form-module"]'],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
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
          section: blockDef.section || null,
        });
      });
    });
  });

  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers (section breaks + DM images)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
