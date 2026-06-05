export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 3) return;

  const imageRow = rows[0];
  const headingRow = rows[1];
  const linkRow = rows[2];

  const imageCells = [...imageRow.children];
  const headingCells = [...headingRow.children];
  const linkCells = [...linkRow.children];

  const colCount = imageCells.length;

  block.innerHTML = '';

  const isSingle = colCount === 1;
  if (isSingle) {
    block.classList.add('single');
  }

  for (let i = 0; i < colCount; i += 1) {
    const col = document.createElement('div');
    col.className = 'columns-banner-col';

    const linkEl = linkCells[i]?.querySelector('a');
    const categoryUrl = linkEl ? linkEl.href : '#';

    const picture = imageCells[i]?.querySelector('picture');

    const strongEl = headingCells[i]?.querySelector('strong');
    const headingText = strongEl ? strongEl.textContent.trim() : '';

    const cellText = headingCells[i]?.textContent?.trim() || '';
    let ctaText = cellText.replace(headingText, '').trim();
    if (!ctaText) {
      ctaText = isSingle ? 'Descubre más' : 'Ver todo';
    }

    const anchor = document.createElement('a');
    anchor.className = 'columns-banner-link';
    anchor.href = categoryUrl;

    if (picture) {
      anchor.appendChild(picture);
    }

    if (headingText) {
      const label = document.createElement('div');
      label.className = 'columns-banner-label';
      const strong = document.createElement('strong');
      strong.textContent = headingText;
      label.appendChild(strong);

      const cta = document.createElement('span');
      cta.className = 'columns-banner-cta';
      cta.textContent = ctaText;
      label.appendChild(cta);

      anchor.appendChild(label);
    }

    col.appendChild(anchor);
    block.appendChild(col);
  }
}
