export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3');
  const list = block.querySelector('ul');
  if (!list) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'category-nav-scroll';

  if (heading) {
    const headingEl = document.createElement('div');
    headingEl.className = 'category-nav-heading';
    headingEl.append(heading);
    block.prepend(headingEl);
  }

  list.classList.add('category-nav-list');
  wrapper.append(list);

  const nav = document.createElement('div');
  nav.className = 'category-nav-arrows';

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'category-nav-prev';
  prevBtn.setAttribute('aria-label', 'Anterior');
  prevBtn.textContent = '‹';

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'category-nav-next';
  nextBtn.setAttribute('aria-label', 'Siguiente');
  nextBtn.textContent = '›';

  nav.append(prevBtn, nextBtn);

  block.textContent = '';
  if (heading) {
    const headingEl = document.createElement('div');
    headingEl.className = 'category-nav-heading';
    headingEl.append(heading);
    block.append(headingEl);
  }
  block.append(wrapper, nav);

  const scrollAmount = 200;
  prevBtn.addEventListener('click', () => { wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' }); });
  nextBtn.addEventListener('click', () => { wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' }); });
}
