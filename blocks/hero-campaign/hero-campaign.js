export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const bgRow = rows[0];
  const textRow = rows[1];
  const ctaRow = rows[2];

  bgRow.classList.add('hero-campaign-bg');
  textRow.classList.add('hero-campaign-text');
  if (ctaRow) ctaRow.classList.add('hero-campaign-cta');

  // Check if the background is a video link (Scene7 /is/content/ pattern)
  const bgLink = bgRow.querySelector('a[href*="/is/content/"]');
  if (bgLink) {
    const videoUrl = bgLink.href;
    const posterUrl = bgLink.closest('picture')
      ? bgLink.closest('picture').querySelector('img')?.src
      : null;

    const video = document.createElement('video');
    video.src = videoUrl;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    if (posterUrl) video.poster = posterUrl;

    const container = bgLink.closest('div') || bgRow.querySelector(':scope > div');
    if (container) {
      container.textContent = '';
      container.append(video);
    }
  }
}
