// ==========================================================================
// THE MAGIC ROOM - WORLD-CLASS CTI DUBAI SCRIPT
// Touches of Magic (Sparkle Canvas) & Alumni Application Handling
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // 1. Touches of Magic: Ambient Twinkling Sparkle Canvas Effect
  initMagicSparkles();

  function initMagicSparkles() {
    const canvas = document.getElementById('magicSparkleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const sparkles = [];
    const sparkleCount = 45;
    const colors = ['#f5a638', '#e63b2e', '#fca96d', '#ffffff', '#ffd700'];

    for (let i = 0; i < sparkleCount; i++) {
      sparkles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random(),
        speed: Math.random() * 0.015 + 0.005,
        vy: -(Math.random() * 0.25 + 0.1)
      });
    }

    function animateSparkles() {
      ctx.clearRect(0, 0, width, height);

      sparkles.forEach(s => {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) {
          s.speed = -s.speed;
        }

        s.y += s.vy;
        if (s.y < 0) {
          s.y = height;
          s.x = Math.random() * width;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();

        if (s.radius > 1.8) {
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(s.x - 4, s.y);
          ctx.lineTo(s.x + 4, s.y);
          ctx.moveTo(s.x, s.y - 4);
          ctx.lineTo(s.x, s.y + 4);
          ctx.stroke();
        }

        ctx.restore();
      });

      requestAnimationFrame(animateSparkles);
    }

    animateSparkles();
  }

  // 2. Application Form Handling & Validation
  const magicApplyForm = document.getElementById('magicApplyForm');
  const applySuccessState = document.getElementById('applySuccessState');
  const successNameDisplay = document.getElementById('successNameDisplay');
  const successEmailDisplay = document.getElementById('successEmailDisplay');
  const resetAppFormBtn = document.getElementById('resetAppFormBtn');
  const phoneNumInput = document.getElementById('phoneNumber');
  const countryCodeSelect = document.getElementById('countryCodeSelect');

  // Phone number input formatter
  if (phoneNumInput) {
    phoneNumInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/[^\d\s-]/g, '');
      e.target.value = val;
    });
  }

  if (magicApplyForm) {
    magicApplyForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const alumniConfirm = document.getElementById('alumniConfirm').checked;
      const fullName = document.getElementById('fullName').value.trim();
      const emailAddr = document.getElementById('emailAddr').value.trim();
      const userLocation = document.getElementById('userLocation').value.trim();
      const countryCode = countryCodeSelect ? countryCodeSelect.value : '+971';
      const rawPhone = phoneNumInput ? phoneNumInput.value.trim() : '';

      if (!alumniConfirm) {
        alert('Please confirm that you are a CTI Dubai / GCC Alumni.');
        return;
      }

      if (!fullName || !emailAddr || !userLocation || !rawPhone) {
        alert('Please fill in all required fields.');
        return;
      }

      const formData = new FormData(magicApplyForm);

      // Submit data seamlessly to Netlify Forms (or static endpoint)
      fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      })
      .then(() => {
        console.log('Form successfully submitted to Netlify Forms');
      })
      .catch((error) => {
        console.warn('Form submission fetch notice:', error);
      });

      if (successNameDisplay) successNameDisplay.textContent = fullName;
      if (successEmailDisplay) successEmailDisplay.textContent = emailAddr;

      magicApplyForm.style.display = 'none';
      if (applySuccessState) {
        applySuccessState.style.display = 'block';
        applySuccessState.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  if (resetAppFormBtn) {
    resetAppFormBtn.addEventListener('click', () => {
      if (magicApplyForm) {
        magicApplyForm.reset();
        magicApplyForm.style.display = 'flex';
      }
      if (applySuccessState) {
        applySuccessState.style.display = 'none';
      }
    });
  }

  // 3. FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 4. Thrive Modal
  const notifyThriveBtn = document.getElementById('notifyThriveBtn');
  const closeNotifyModalBtn = document.getElementById('closeNotifyModalBtn');
  const notifyModalOverlay = document.getElementById('notifyModalOverlay');

  if (notifyThriveBtn) {
    notifyThriveBtn.addEventListener('click', () => {
      notifyModalOverlay.classList.add('active');
    });
  }

  if (closeNotifyModalBtn) {
    closeNotifyModalBtn.addEventListener('click', () => {
      notifyModalOverlay.classList.remove('active');
    });
  }

  if (notifyModalOverlay) {
    notifyModalOverlay.addEventListener('click', (e) => {
      if (e.target === notifyModalOverlay) {
        notifyModalOverlay.classList.remove('active');
      }
    });
  }

});
