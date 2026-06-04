/**
 * Columns Category block — two category links with full-bleed images
 * and text overlay at the bottom.
 *
 * Expected authored structure (per row):
 *   cell: <picture> + <p><a>category name</a></p>
 *
 * Decorated structure:
 *   .columns-category > div (row) > div (cell) > a.category-link[href]
 *     > picture + span.category-label
 */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-category-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const picture = col.querySelector('picture');
      const link = col.querySelector('a');

      if (picture && link) {
        // Wrap the cell content in a single <a> element
        const wrapper = document.createElement('a');
        wrapper.href = link.href;
        wrapper.className = 'category-link';

        // Create the text label
        const label = document.createElement('span');
        label.className = 'category-label';
        label.textContent = link.textContent;

        // Build the new structure
        wrapper.append(picture);
        wrapper.append(label);

        // Clear the cell and add the wrapper
        col.replaceChildren(wrapper);
      }
    });
  });
}
