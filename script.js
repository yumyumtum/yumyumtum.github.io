// Custom cursor
const cursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// Grow cursor on hover
const interactiveElements = document.querySelectorAll('a, .box');
interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
});

// Random glitch effect
setInterval(() => {
  const vhsText = document.querySelector('.vhs-text');
  if (vhsText && Math.random() > 0.95) {
    vhsText.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
    setTimeout(() => {
      vhsText.style.transform = 'translateX(0)';
    }, 50);
  }
}, 100);
