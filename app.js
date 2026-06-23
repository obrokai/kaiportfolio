// nav scroll state
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// page load reveal
window.addEventListener('load', () => document.body.classList.add('loaded'));
setTimeout(() => document.body.classList.add('loaded'), 200);

// scroll-triggered reveals
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = (e.target.dataset.d || 0) + 'ms';
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
document.querySelectorAll('.reveal-up').forEach((el, i) => {
  el.dataset.d = (i % 3) * 90;
  io.observe(el);
});

// lightbox
const lb = document.getElementById('lb');
const lbimg = document.getElementById('lbimg');
function openLb(el) {
  const src = el.getAttribute('data-lb');
  if (!src || !lb) return false;
  lbimg.src = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  return false;
}
function closeLb() {
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
}
if (lb) lb.addEventListener('click', closeLb);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });

// before/after slider
const ba = document.getElementById('ba');
if (ba) {
  const frame = ba.querySelector('.ba-frame');
  const after = ba.querySelector('.layer.after');
  const divider = ba.querySelector('.ba-divider');
  let dragging = false;
  function setPos(clientX) {
    const r = frame.getBoundingClientRect();
    let pct = ((clientX - r.left) / r.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    after.style.clipPath = `inset(0 0 0 ${pct}%)`;
    divider.style.left = pct + '%';
  }
  const start = (e) => { dragging = true; document.body.style.cursor = 'ew-resize'; };
  const move = (e) => {
    if (!dragging) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    setPos(x);
    e.preventDefault();
  };
  const end = () => { dragging = false; document.body.style.cursor = ''; };
  divider.addEventListener('mousedown', start);
  divider.addEventListener('touchstart', start, { passive: true });
  window.addEventListener('mousemove', move);
  window.addEventListener('touchmove', move, { passive: false });
  window.addEventListener('mouseup', end);
  window.addEventListener('touchend', end);
  // click-to-jump
  frame.addEventListener('click', (e) => {
    if (e.target.closest('.ba-divider')) return;
    setPos(e.clientX);
  });
}
