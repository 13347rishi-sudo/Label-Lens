/**
 * LabelLens UI Animations & Dynamic Enhancements
 * Streamlit rerenders dynamically, so we observe mutations as well as DOMContentLoaded.
 */

function applyCardStagger() {
  const cards = document.querySelectorAll('[data-stagger]:not([data-animated])');
  cards.forEach((card, i) => {
    card.setAttribute('data-animated', 'true');
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
    setTimeout(() => {
      card.style.transition = 'opacity 400ms ease-out, transform 400ms cubic-bezier(0.23, 1, 0.32, 1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 60);
  });
}

// Observe DOM mutations for Streamlit rerenders
const observer = new MutationObserver(() => {
  applyCardStagger();
});

document.addEventListener('DOMContentLoaded', () => {
  applyCardStagger();
  observer.observe(document.body, { childList: true, subtree: true });
});

// Also run immediately if script executes after DOMContentLoaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  applyCardStagger();
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
}
