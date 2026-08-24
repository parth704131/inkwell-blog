const searchToggle = document.querySelector('.search-toggle');
const searchPanel = document.querySelector('.search-panel');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

function toggleRegion(button, region) {
  const willOpen = region.hidden;
  region.hidden = !willOpen;
  button.setAttribute('aria-expanded', String(willOpen));
  if (willOpen) region.querySelector('input, a')?.focus();
}

searchToggle?.addEventListener('click', () => toggleRegion(searchToggle, searchPanel));
menuToggle?.addEventListener('click', () => toggleRegion(menuToggle, mobileNav));

document.querySelector('[data-newsletter-form]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  button.textContent = 'You’re on the list ✓';
  button.disabled = true;
});
