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

// === EXPLOSION EFFECT ===
// Create explosion overlay
const explosionOverlay = document.createElement('div');
explosionOverlay.id = 'explosionOverlay';
document.body.appendChild(explosionOverlay);

// Intercept all link clicks
document.addEventListener('click', (e) => {
  const link = e.target.closest('a, .box');
  
  if (link && link.href) {
    e.preventDefault(); // Stop immediate navigation
    
    const targetUrl = link.href;
    
    // Trigger shake
    document.body.classList.add('shake');
    
    // After shake starts, trigger explosion
    setTimeout(() => {
      explosionOverlay.classList.add('active');
      document.body.classList.add('exploding');
    }, 300);
    
    // Navigate after explosion completes
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 900);
  }
});

