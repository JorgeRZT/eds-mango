/**
 * Columns Category block — category links with full-bleed images and text overlay.
 *
 * Expected authored structure (per cell):
 *   <picture> + optional <p>Category Title</p> + <p><a href="...">Ver todo</a></p>
 *
 * Decorated structure:
 *   .columns-category > div (row) > div (cell) > a.category-link[href]
 *     > picture + div.category-text > span.category-title + span.category-cta
 */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-category-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const picture = col.querySelector('picture');
      const link = col.querySelector('a');

      if (picture && link) {
        const wrapper = document.createElement('a');
        wrapper.href = link.href;
        wrapper.className = 'category-link';

        // Title: text from paragraphs that don't contain a link
        const titleText = [...col.querySelectorAll('p')]
          .filter((p) => !p.querySelector('a'))
          .map((p) => p.textContent.trim())
          .filter(Boolean)
          .join(' ');

        const ctaText = link.textContent.trim();

        wrapper.append(picture);

        const textContainer = document.createElement('div');
        textContainer.className = 'category-text';

        if (titleText) {
          const titleEl = document.createElement('span');
          titleEl.className = 'category-title';
          titleEl.textContent = titleText;
          textContainer.append(titleEl);
        }

        const ctaEl = document.createElement('span');
        ctaEl.className = 'category-cta';
        ctaEl.textContent = ctaText;
        textContainer.append(ctaEl);

        wrapper.append(textContainer);
        col.replaceChildren(wrapper);
      }
    });
  });
}
