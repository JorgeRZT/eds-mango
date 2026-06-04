export default function decorate(block) {
  const slides = [...block.children];

  slides.forEach((slide) => {
    slide.classList.add('hero-campaign-slide');
    if (!slide.querySelector('picture')) slide.classList.add('no-image');
  });

  if (slides.length <= 1) return;

  // Wrap slides
  const slidesWrapper = document.createElement('div');
  slidesWrapper.className = 'hero-campaign-slides';
  slides.forEach((slide) => {
    slide.setAttribute('aria-hidden', 'true');
    slidesWrapper.append(slide);
  });
  block.append(slidesWrapper);

  // Dot navigation
  const dotsEl = document.createElement('div');
  dotsEl.className = 'hero-campaign-dots';
  dotsEl.setAttribute('aria-label', 'Slide navigation');
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Ir al slide ${i + 1}`);
    dot.setAttribute('type', 'button');
    dotsEl.append(dot);
  });
  block.append(dotsEl);

  let current = 0;
  let autoTimer;

  function goToSlide(idx) {
    const prev = current;
    current = (idx + slides.length) % slides.length;
    slides[prev].classList.remove('active');
    slides[prev].setAttribute('aria-hidden', 'true');
    dotsEl.children[prev].classList.remove('active');
    slides[current].classList.add('active');
    slides[current].setAttribute('aria-hidden', 'false');
    dotsEl.children[current].classList.add('active');
  }

  function startAuto() {
    autoTimer = setInterval(() => goToSlide(current + 1), 5000);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  // Init first slide
  goToSlide(0);
  startAuto();

  // Pause on hover
  block.addEventListener('mouseenter', stopAuto);
  block.addEventListener('mouseleave', startAuto);

  // Dot clicks
  [...dotsEl.children].forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAuto();
      goToSlide(i);
      startAuto();
    });
  });

  // Keyboard arrow navigation
  block.setAttribute('tabindex', '0');
  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { stopAuto(); goToSlide(current + 1); startAuto(); }
    if (e.key === 'ArrowLeft') { stopAuto(); goToSlide(current - 1); startAuto(); }
  });
}
