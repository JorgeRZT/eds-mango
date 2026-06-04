/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroCampaignParser from './parsers/hero-campaign.js';
import heroBrandedParser from './parsers/hero-branded.js';
import columnsCategoryParser from './parsers/columns-category.js';

// TRANSFORMER IMPORTS
import mangoCleanupTransformer from './transformers/mango-cleanup.js';
import mangoSectionsTransformer from './transformers/mango-sections.js';
import mangoDmImagesTransformer from './transformers/mango-dm-images.js';

// PARSER REGISTRY
const parsers = {
  'hero-campaign': heroCampaignParser,
  'hero-branded': heroBrandedParser,
  'columns-category': columnsCategoryParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Mango homepage with hero banners, product categories, and promotional content',
  urls: ['https://shop.mango.com/es/es/h/home'],
  blocks: [
    {
      name: 'hero-campaign',
      instances: ['div[class*="BannerFullHeightWrapper-module"][class*="bannerFullHeightWrapper"]']
    },
    {
      name: 'hero-branded',
      instances: ['a[href*="mango-style-club"][class*="BannerBackgroundLinkWrapper-module"]']
    },
    {
      name: 'columns-category',
      instances: ['div[class*="FamilyBannerShop-module"][class*="root"]']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'SEO Category Navigation',
      selector: 'div[class*="SeoBanner-module"][class*="root"]',
      style: null,
      blocks: [],
      defaultContent: ['div[class*="SeoBanner-module"][class*="root"] h1', 'div[class*="SeoBanner-module"][class*="root"] ul']
    },
    {
      id: 'section-2',
      name: 'Hero New Now',
      selector: 'div[class*="BannerFullHeightWrapper-module"][class*="bannerFullHeightWrapper"]:nth-of-type(1)',
      style: null,
      blocks: ['hero-campaign'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Category Columns 1',
      selector: 'div[class*="FamilyBannerShop-module"][class*="root"]:nth-of-type(1)',
      style: null,
      blocks: ['columns-category'],
      defaultContent: []
    },
    {
      id: 'section-4',
      name: 'Category Columns 2',
      selector: 'div[class*="FamilyBannerShop-module"][class*="root"]:nth-of-type(2)',
      style: null,
      blocks: ['columns-category'],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'Hero Summer Living',
      selector: 'div[class*="BannerFullHeightWrapper-module"][class*="bannerFullHeightWrapper"]:nth-of-type(2)',
      style: null,
      blocks: ['hero-campaign'],
      defaultContent: []
    },
    {
      id: 'section-6',
      name: 'Hero Pijamas',
      selector: 'div[class*="BannerFullHeightWrapper-module"][class*="bannerFullHeightWrapper"]:nth-of-type(3)',
      style: null,
      blocks: ['hero-campaign'],
      defaultContent: []
    },
    {
      id: 'section-7',
      name: 'Hero Total White',
      selector: 'div[class*="BannerFullHeightWrapper-module"][class*="bannerFullHeightWrapper"]:nth-of-type(4)',
      style: null,
      blocks: ['hero-campaign'],
      defaultContent: []
    },
    {
      id: 'section-8',
      name: 'Hero Lino',
      selector: 'div[class*="BannerFullHeightWrapper-module"][class*="bannerFullHeightWrapper"]:nth-of-type(5)',
      style: null,
      blocks: ['hero-campaign'],
      defaultContent: []
    },
    {
      id: 'section-9',
      name: 'Hero Mango Style Club',
      selector: 'div[class*="BannerFullHeightWrapper-module"][class*="bannerFullHeightWrapper"]:nth-of-type(6)',
      style: null,
      blocks: ['hero-branded'],
      defaultContent: []
    },
    {
      id: 'section-10',
      name: 'Newsletter Subscription',
      selector: 'div[class*="Footer-module"][class*="footer"]',
      style: null,
      blocks: [],
      defaultContent: ['div[class*="Footer-module"] [class*="title"]', 'div[class*="Footer-module"] form']
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  mangoCleanupTransformer,
  mangoDmImagesTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [mangoSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
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
      } else {
        console.warn(`No parser found for block: ${block.name}`);
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
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      }
    }];
  }
};
