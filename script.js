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

// ===== FIRE EXPLOSION EFFECT =====
const fireCanvas = document.getElementById('fireCanvas');
const ctx = fireCanvas ? fireCanvas.getContext('2d') : null;

let particles = [];
let animationId = null;

class FireParticle {
  constructor(x, y, type = 'fire') {
    this.x = x;
    this.y = y;
    this.type = type;
    
    if (type === 'fire') {
      // Main fire particles
      this.vx = (Math.random() - 0.5) * 8;
      this.vy = (Math.random() - 0.5) * 8 - Math.random() * 3;
      this.life = 1.0;
      this.decay = Math.random() * 0.015 + 0.01;
      this.size = Math.random() * 30 + 20;
    } else if (type === 'ember') {
      // Flying embers
      this.vx = (Math.random() - 0.5) * 6;
      this.vy = -Math.random() * 8 - 5;
      this.life = 1.0;
      this.decay = Math.random() * 0.02 + 0.01;
      this.size = Math.random() * 8 + 3;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.2;
    } else if (type === 'smoke') {
      // Smoke particles
      this.vx = (Math.random() - 0.5) * 4;
      this.vy = -Math.random() * 3 - 1;
      this.life = 1.0;
      this.decay = Math.random() * 0.008 + 0.005;
      this.size = Math.random() * 50 + 30;
    }
    
    this.gravity = type === 'ember' ? -0.15 : 0.1;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life -= this.decay;
    
    if (this.type === 'ember') {
      this.rotation += this.rotationSpeed;
    }
    
    // Friction
    this.vx *= 0.98;
    this.vy *= 0.98;
    
    return this.life > 0;
  }
  
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life;
    
    if (this.type === 'fire') {
      // Gradient fire
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      gradient.addColorStop(0, `rgba(255, 255, 200, ${this.life})`);
      gradient.addColorStop(0.3, `rgba(255, 200, 0, ${this.life * 0.8})`);
      gradient.addColorStop(0.6, `rgba(255, 100, 0, ${this.life * 0.5})`);
      gradient.addColorStop(1, `rgba(255, 0, 0, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      
    } else if (this.type === 'ember') {
      // Glowing ember
      ctx.fillStyle = `rgba(255, ${100 + Math.random() * 155}, 0, ${this.life})`;
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(255, 150, 0, 1)';
      
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      
    } else if (this.type === 'smoke') {
      // Gray smoke
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      gradient.addColorStop(0, `rgba(100, 100, 100, ${this.life * 0.3})`);
      gradient.addColorStop(1, `rgba(50, 50, 50, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
}

function createFireExplosion(x, y) {
  // Main fire burst
  for (let i = 0; i < 60; i++) {
    particles.push(new FireParticle(x, y, 'fire'));
  }
  
  // Flying embers
  for (let i = 0; i < 30; i++) {
    particles.push(new FireParticle(x, y, 'ember'));
  }
  
  // Smoke
  for (let i = 0; i < 20; i++) {
    particles.push(new FireParticle(x, y, 'smoke'));
  }
}

function animateFireExplosion() {
  ctx.clearRect(0, 0, fireCanvas.width, fireCanvas.height);
  
  particles = particles.filter(p => {
    const alive = p.update();
    if (alive) p.draw(ctx);
    return alive;
  });
  
  if (particles.length > 0) {
    animationId = requestAnimationFrame(animateFireExplosion);
  } else {
    fireCanvas.style.display = 'none';
    animationId = null;
  }
}

// Intercept clicks on menu boxes
document.addEventListener('click', (e) => {
  const box = e.target.closest('.box');
  if (box && ctx) {
    e.preventDefault();
    
    const targetUrl = box.getAttribute('href');
    const rect = box.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Setup canvas
    fireCanvas.width = window.innerWidth;
    fireCanvas.height = window.innerHeight;
    fireCanvas.style.display = 'block';
    
    // Screen flash
    document.body.style.transition = 'none';
    document.body.style.filter = 'brightness(2)';
    setTimeout(() => {
      document.body.style.transition = 'filter 0.3s ease';
      document.body.style.filter = 'brightness(1)';
    }, 50);
    
    // Create explosion
    particles = [];
    createFireExplosion(x, y);
    
    if (animationId) cancelAnimationFrame(animationId);
    animateFireExplosion();
    
    // Navigate after explosion
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 800);
  }
}, true);

// Handle window resize
window.addEventListener('resize', () => {
  if (fireCanvas && ctx) {
    fireCanvas.width = window.innerWidth;
    fireCanvas.height = window.innerHeight;
  }
});
