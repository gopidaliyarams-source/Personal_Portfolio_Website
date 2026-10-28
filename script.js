document.addEventListener('DOMContentLoaded', () => {
  // Smooth in-page navigation.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const targetId = decodeURIComponent(link.getAttribute('href').slice(1));
      if (!targetId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.getElementById(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + targetId);
      }
    });
  });

  // Save contact form submissions in the SQLite database through the Express API.
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async event => {
      event.preventDefault();
      const feedback = document.getElementById('contact-feedback');
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const payload = {
        name: document.getElementById('contact-name').value.trim(),
        email: document.getElementById('contact-email').value.trim(),
        message: document.getElementById('contact-message').value.trim()
      };

      if (!payload.name || !payload.email || !payload.message) {
        if (feedback) feedback.textContent = 'Please complete all fields.';
        return;
      }
      if (feedback) feedback.textContent = 'Saving your message…';
      if (submitButton) submitButton.disabled = true;

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Unable to save your message.');
        if (feedback) feedback.textContent = 'Thank you! Your message was saved successfully.';
        contactForm.reset();
      } catch (error) {
        if (feedback) {
          feedback.textContent = 'Could not save the message. Please make sure the website server is running, then try again.';
        }
        console.error(error);
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  document.querySelectorAll('[data-action="demo"]').forEach(button => {
    button.addEventListener('click', () => {
      const status = button.parentElement.querySelector('[role="status"]');
      if (status) status.textContent = 'This is a portfolio demo. Contact me to learn more.';
      else alert('This is a portfolio demo. Contact gopidaliyarams@gmail.com to learn more.');
    });
  });
});
