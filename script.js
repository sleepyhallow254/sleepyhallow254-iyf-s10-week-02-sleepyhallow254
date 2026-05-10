// Basic UI enhancements: smooth scroll + active nav highlight + contact form UX

(() => {
  const navbarLinks = Array.from(document.querySelectorAll('.navbar a'));
  const sections = navbarLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  // Smooth scroll
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.navbar a');
    if (!link) return;

    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Active section highlight on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      // pick the most visible intersecting section
      const visible = entries
        .filter((x) => x.isIntersecting)
        .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

      if (!visible) return;

      const id = visible.target.id;
      navbarLinks.forEach((a) => {
        const match = a.getAttribute('href') === `#${id}`;
        a.classList.toggle('active', match);
      });
    },
    { root: null, threshold: [0.2, 0.35, 0.5, 0.65] }
  );

  sections.forEach((s) => observer.observe(s));

  // Skills: show simple example when clicked
  const skillButtons = Array.from(document.querySelectorAll('button.skill'));
  if (skillButtons.length) {
    const toggleSkill = (btn) => {
      const targetId = btn.getAttribute('data-skill-target');
      if (!targetId) return;

      const panel = document.getElementById(targetId);
      if (!panel) return;

      // Close all others
      skillButtons.forEach((other) => {
        const otherId = other.getAttribute('data-skill-target');
        const otherPanel = otherId ? document.getElementById(otherId) : null;
        if (!otherPanel || other === btn) return;

        otherPanel.hidden = true;
        other.setAttribute('aria-expanded', 'false');
      });

      // Toggle this one
      const isHidden = panel.hidden;
      panel.hidden = !isHidden;
      btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    };

    skillButtons.forEach((btn) => {
      btn.addEventListener('click', () => toggleSkill(btn));
    });
  }

  // Contact form: prevent reload + show message
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();

      status.textContent = `Thanks${name ? `, ${name}` : ''}! Your message is ready to send.`;
      status.classList.add('success');

      // If you want real sending, connect to a backend or a form service.
      // For now we just trigger the user's email client with the entered message.
      const email = (data.get('email') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      const to = 'your-email@example.com';
      const subject = encodeURIComponent(`Portfolio contact from ${name || 'visitor'}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }
})();

