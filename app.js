const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
const header = document.querySelector('.site-header');
const closeMenu = (restoreFocus = false) => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  if (restoreFocus) menu.focus();
};
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('open', !expanded);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) closeMenu(true);
});
document.addEventListener('click', event => {
  if (nav.classList.contains('open') && !header.contains(event.target)) closeMenu();
});
try {
  if (sessionStorage.getItem('ece-studio-intro-v3')) document.querySelector('.splash').classList.add('skip-splash');
  sessionStorage.setItem('ece-studio-intro-v3', '1');
} catch {}
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 15), {passive:true});
// The native disclosures remain usable without JavaScript.
const areaDetails = [...document.querySelectorAll('.area-list details')];
areaDetails.forEach(item => item.addEventListener('toggle', () => {
  if (item.open) areaDetails.forEach(other => {if (other !== item) other.open = false;});
}));
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) nav.querySelectorAll('a').forEach(link => {
        if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, {rootMargin:'-20% 0px -55% 0px'});
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {rootMargin:'0px 0px 30px 0px',threshold:.05});
    document.querySelectorAll('[data-reveal]').forEach(element => {
      // Keep anything already in view visible on reload or an anchor visit.
      if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add('reveal-ready');
      revealObserver.observe(element);
    });
  }
}

const diagram = document.querySelector('.approach-diagram');
if (diagram && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const diagramObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      diagram.classList.add('diagram-visible');
      diagramObserver.disconnect();
    }
  }, {threshold:.3});
  diagramObserver.observe(diagram);
}
