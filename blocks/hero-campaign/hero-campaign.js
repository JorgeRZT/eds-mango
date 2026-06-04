function isVideoSrc(url) {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url) || /\/is\/content\//i.test(url);
}

function buildVideo(src, poster) {
  const video = document.createElement('video');
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.setAttribute('loop', '');
  video.setAttribute('playsinline', '');
  if (poster) video.poster = poster;
  video.src = src;

  const track = document.createElement('track');
  track.kind = 'captions';
  video.append(track);

  return video;
}

function addPlayPauseButton(container, video) {
  const btn = document.createElement('button');
  btn.className = 'hero-campaign-play-pause';
  btn.setAttribute('type', 'button');
  btn.setAttribute('aria-label', 'Pausar');
  btn.setAttribute('aria-pressed', 'true');

  btn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      btn.setAttribute('aria-label', 'Pausar');
      btn.setAttribute('aria-pressed', 'true');
      btn.classList.remove('paused');
    } else {
      video.pause();
      btn.setAttribute('aria-label', 'Reproducir');
      btn.setAttribute('aria-pressed', 'false');
      btn.classList.add('paused');
    }
  });

  container.append(btn);
}

function decorateSlide(slide) {
  const mediaCell = slide.querySelector(':scope > div:first-child');
  if (!mediaCell) return;

  // Check for a video link authored as <a href="video-url">
  const videoLink = [...mediaCell.querySelectorAll('a')].find((a) => isVideoSrc(a.href));

  if (videoLink) {
    // Get optional poster image from a picture sibling
    const posterImg = mediaCell.querySelector('picture img');
    const poster = posterImg ? posterImg.src : null;

    const video = buildVideo(videoLink.href, poster);
    const videoWrapper = document.createElement('div');
    videoWrapper.className = 'hero-campaign-video';
    videoWrapper.append(video);
    addPlayPauseButton(videoWrapper, video);

    // Replace the authored cell content with the video wrapper
    mediaCell.replaceChildren(videoWrapper);
  } else if (!mediaCell.querySelector('picture')) {
    slide.classList.add('no-image');
  }
}

export default function decorate(block) {
  const slides = [...block.children];

  slides.forEach((slide) => {
    slide.classList.add('hero-campaign-slide');
    decorateSlide(slide);
  });

  if (slides.length <= 1) return;

  // Wrap slides for carousel
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

  goToSlide(0);
  startAuto();

  block.addEventListener('mouseenter', stopAuto);
  block.addEventListener('mouseleave', startAuto);

  [...dotsEl.children].forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAuto();
      goToSlide(i);
      startAuto();
    });
  });

  block.setAttribute('tabindex', '0');
  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { stopAuto(); goToSlide(current + 1); startAuto(); }
    if (e.key === 'ArrowLeft') { stopAuto(); goToSlide(current - 1); startAuto(); }
  });
}
