export default function decorate(block) {
  // Extract content from authored rows
  const rows = [...block.children];
  const videoRow = rows[0];
  const headingRow = rows[1];
  const ctaRow = rows[2];

  // Get video URL from first row's link
  const videoLink = videoRow?.querySelector('a');
  const videoSrc = videoLink?.href || videoLink?.textContent?.trim() || '';

  // Get heading from second row
  const heading = headingRow?.querySelector('h2, h3, h4');

  // Get CTA link from third row
  const ctaLink = ctaRow?.querySelector('a');

  // Clear block content
  block.textContent = '';

  // Create video element
  const video = document.createElement('video');
  video.src = videoSrc;
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');

  // Create video container
  const videoContainer = document.createElement('div');
  videoContainer.className = 'hero-video-bg';
  videoContainer.append(video);

  // Create content overlay
  const content = document.createElement('div');
  content.className = 'hero-video-content';

  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent;
    content.append(h2);
  }

  if (ctaLink) {
    const cta = document.createElement('p');
    cta.className = 'hero-video-cta';
    const link = document.createElement('a');
    link.href = ctaLink.href;
    link.textContent = ctaLink.textContent;
    cta.append(link);
    content.append(cta);
  }

  // Create play/pause button
  const playPauseBtn = document.createElement('button');
  playPauseBtn.className = 'hero-video-control';
  playPauseBtn.setAttribute('aria-label', 'Pausar');
  playPauseBtn.setAttribute('aria-pressed', 'true');
  playPauseBtn.setAttribute('type', 'button');
  playPauseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16" class="icon-pause"><path d="M6 13H5V3h1zm5 0h-1V3h1z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16" class="icon-play"><path fill-rule="evenodd" d="M14 8 4 13.196V2.804zm-9 3.55L11.831 8 5 4.45z" clip-rule="evenodd"></path></svg>';

  playPauseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (video.paused) {
      video.play();
      playPauseBtn.setAttribute('aria-label', 'Pausar');
      playPauseBtn.setAttribute('aria-pressed', 'true');
      playPauseBtn.classList.remove('paused');
    } else {
      video.pause();
      playPauseBtn.setAttribute('aria-label', 'Reproducir');
      playPauseBtn.setAttribute('aria-pressed', 'false');
      playPauseBtn.classList.add('paused');
    }
  });

  // Assemble block
  block.append(videoContainer);
  block.append(content);
  block.append(playPauseBtn);

  // Wrap entire block in a link if CTA has href
  if (ctaLink?.href) {
    block.dataset.href = ctaLink.href;
    block.style.cursor = 'pointer';
    block.addEventListener('click', (e) => {
      if (e.target.closest('.hero-video-control')) return;
      window.location.href = ctaLink.href;
    });
  }
}
