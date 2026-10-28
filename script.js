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

  // Phone number input formatter + country code detection
  const COUNTRY_CODES = {
    '971': ['🇦🇪', 'UAE'], '966': ['🇸🇦', 'Saudi Arabia'], '974': ['🇶🇦', 'Qatar'],
    '965': ['🇰🇼', 'Kuwait'], '973': ['🇧🇭', 'Bahrain'], '968': ['🇴🇲', 'Oman'],
    '962': ['🇯🇴', 'Jordan'], '961': ['🇱🇧', 'Lebanon'], '20': ['🇪🇬', 'Egypt'],
    '212': ['🇲🇦', 'Morocco'], '216': ['🇹🇳', 'Tunisia'], '213': ['🇩🇿', 'Algeria'],
    '964': ['🇮🇶', 'Iraq'], '963': ['🇸🇾', 'Syria'], '970': ['🇵🇸', 'Palestine'],
    '967': ['🇾🇪', 'Yemen'], '98': ['🇮🇷', 'Iran'], '90': ['🇹🇷', 'Türkiye'],
    '44': ['🇬🇧', 'UK'], '1': ['🇺🇸', 'USA / Canada'], '91': ['🇮🇳', 'India'],
    '92': ['🇵🇰', 'Pakistan'], '880': ['🇧🇩', 'Bangladesh'], '94': ['🇱🇰', 'Sri Lanka'],
    '977': ['🇳🇵', 'Nepal'], '63': ['🇵🇭', 'Philippines'], '62': ['🇮🇩', 'Indonesia'],
    '60': ['🇲🇾', 'Malaysia'], '65': ['🇸🇬', 'Singapore'], '66': ['🇹🇭', 'Thailand'],
    '84': ['🇻🇳', 'Vietnam'], '86': ['🇨🇳', 'China'], '852': ['🇭🇰', 'Hong Kong'],
    '81': ['🇯🇵', 'Japan'], '82': ['🇰🇷', 'South Korea'], '61': ['🇦🇺', 'Australia'],
    '64': ['🇳🇿', 'New Zealand'], '27': ['🇿🇦', 'South Africa'], '234': ['🇳🇬', 'Nigeria'],
    '254': ['🇰🇪', 'Kenya'], '251': ['🇪🇹', 'Ethiopia'], '49': ['🇩🇪', 'Germany'],
    '33': ['🇫🇷', 'France'], '39': ['🇮🇹', 'Italy'], '34': ['🇪🇸', 'Spain'],
    '351': ['🇵🇹', 'Portugal'], '31': ['🇳🇱', 'Netherlands'], '32': ['🇧🇪', 'Belgium'],
    '41': ['🇨🇭', 'Switzerland'], '43': ['🇦🇹', 'Austria'], '46': ['🇸🇪', 'Sweden'],
    '47': ['🇳🇴', 'Norway'], '45': ['🇩🇰', 'Denmark'], '358': ['🇫🇮', 'Finland'],
    '353': ['🇮🇪', 'Ireland'], '48': ['🇵🇱', 'Poland'], '30': ['🇬🇷', 'Greece'],
    '7': ['🇷🇺', 'Russia / Kazakhstan'], '380': ['🇺🇦', 'Ukraine'], '55': ['🇧🇷', 'Brazil'],
    '52': ['🇲🇽', 'Mexico'], '54': ['🇦🇷', 'Argentina'], '57': ['🇨🇴', 'Colombia'],
    '56': ['🇨🇱', 'Chile']
  };
  const phoneCountryBadge = document.getElementById('phoneCountryBadge');
  const detectedCountryInput = document.getElementById('detectedCountry');

  function detectCountry(digits) {
    for (let len = 3; len >= 1; len--) {
      const code = digits.slice(0, len);
      if (digits.length >= len && COUNTRY_CODES[code]) return { code, info: COUNTRY_CODES[code] };
    }
    return null;
  }

  function updateCountryBadge() {
    if (!phoneCountryBadge || !phoneNumInput) return;
    const digits = phoneNumInput.value.replace(/\D/g, '');
    const match = detectCountry(digits);
    if (match) {
      const [flag, name] = match.info;
      phoneCountryBadge.innerHTML = `<span class="flag">${flag}</span><span>${name}</span>`;
      phoneCountryBadge.classList.add('visible');
      if (detectedCountryInput) detectedCountryInput.value = `${name} (+${match.code})`;
    } else {
      phoneCountryBadge.classList.remove('visible');
      phoneCountryBadge.innerHTML = '';
      if (detectedCountryInput) detectedCountryInput.value = '';
    }
  }

  if (phoneNumInput) {
    phoneNumInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/[^\d\s]/g, '');
      e.target.value = val;
      updateCountryBadge();
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
      buildInboxButtons(emailAddr);
      startEmailCountdown();

      magicApplyForm.style.display = 'none';
      if (applySuccessState) {
        applySuccessState.style.display = 'block';
        applySuccessState.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // Success-state helpers: inbox shortcuts + 60s countdown
  const emailCountdown = document.getElementById('emailCountdown');
  const spamCallout = document.getElementById('spamCallout');
  const spamCalloutTitle = document.getElementById('spamCalloutTitle');
  const spamActions = document.getElementById('spamActions');
  let countdownTimer = null;

  function buildInboxButtons(email) {
    if (!spamActions) return;
    const domain = (email.split('@')[1] || '').toLowerCase();
    const q = encodeURIComponent('"Magic Room"');
    let links = [];
    if (/^(gmail|googlemail)\./.test(domain)) {
      links = [
        ['Open Gmail Promotions', 'https://mail.google.com/mail/u/0/#category/promotions'],
        ['Open Gmail Spam', 'https://mail.google.com/mail/u/0/#spam'],
        ['Search all mail', `https://mail.google.com/mail/u/0/#search/in%3Aanywhere+${q}`]
      ];
    } else if (/^(outlook|hotmail|live|msn)\./.test(domain)) {
      links = [
        ['Open Outlook Inbox', 'https://outlook.live.com/mail/0/inbox'],
        ['Open Junk Email', 'https://outlook.live.com/mail/0/junkemail']
      ];
    } else if (/^(yahoo|ymail)\./.test(domain)) {
      links = [['Open Yahoo Mail', 'https://mail.yahoo.com/']];
    } else if (/^(icloud|me|mac)\./.test(domain)) {
      links = [['Open iCloud Mail', 'https://www.icloud.com/mail']];
    }
    spamActions.innerHTML = links.map(([label, url], i) =>
      `<a href="${url}" target="_blank" rel="noopener" class="spam-action-btn${i ? ' ghost' : ''}">${label} ↗</a>`
    ).join('');
  }

  function startEmailCountdown() {
    if (!emailCountdown) return;
    clearInterval(countdownTimer);
    if (spamCallout) spamCallout.classList.remove('urgent');
    if (spamCalloutTitle) spamCalloutTitle.textContent = 'Not in your inbox? Check your Promotions & Spam folders';
    let remaining = 60;
    emailCountdown.textContent = `⏳ Expected in about ${remaining}s…`;
    countdownTimer = setInterval(() => {
      remaining--;
      if (remaining > 0) {
        emailCountdown.textContent = `⏳ Expected in about ${remaining}s…`;
      } else {
        clearInterval(countdownTimer);
        emailCountdown.textContent = '✉️ Your email should have arrived by now.';
        if (spamCalloutTitle) spamCalloutTitle.textContent = 'Still nothing? Check your Promotions & Spam folders now';
        if (spamCallout) {
          spamCallout.classList.add('urgent');
          spamCallout.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 1000);
  }

  if (resetAppFormBtn) {
    resetAppFormBtn.addEventListener('click', () => {
      clearInterval(countdownTimer);
      if (magicApplyForm) {
        magicApplyForm.reset();
        updateCountryBadge();
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

  // 5. Stacked Sneak Peek Card Switcher & Auto-Rotate
  const peekTabBtns = document.querySelectorAll('.peek-tab-btn');
  const stackedCards = document.querySelectorAll('.stacked-peek-card');
  const peekCardStack = document.getElementById('peekCardStack');
  let activeCardIndex = 0;
  let peekAutoTimer = null;

  function switchPeekCard(index) {
    activeCardIndex = index;
    peekTabBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === index);
    });
    stackedCards.forEach((card, idx) => {
      card.classList.toggle('active', idx === index);
    });
  }

  function startPeekAutoRotate() {
    stopPeekAutoRotate();
    if (stackedCards.length > 1) {
      peekAutoTimer = setInterval(() => {
        activeCardIndex = (activeCardIndex + 1) % stackedCards.length;
        switchPeekCard(activeCardIndex);
      }, 4500);
    }
  }

  function stopPeekAutoRotate() {
    if (peekAutoTimer) clearInterval(peekAutoTimer);
  }

  peekTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.getAttribute('data-index'), 10);
      switchPeekCard(index);
      startPeekAutoRotate();
    });
  });

  if (peekCardStack) {
    peekCardStack.addEventListener('mouseenter', stopPeekAutoRotate);
    peekCardStack.addEventListener('mouseleave', startPeekAutoRotate);
    startPeekAutoRotate();
  }

});
