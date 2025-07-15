document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const loading = form.querySelector('.loading');
    const errorMessage = form.querySelector('.error-message');
    const sentMessage = form.querySelector('.sent-message');

    // Reset states
    loading.style.display = 'block';
    errorMessage.style.display = 'none';
    sentMessage.style.display = 'none';

    const data = new FormData(form);
    const action = form.getAttribute("action");

    try {
      const response = await fetch(action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      loading.style.display = 'none';

      if (response.ok) {
        // Success: redirect to thank you page
        window.location.href = "thanks.html";
        return;
      }

      // Try to parse JSON to find detailed errors
      let userMessage = "Oops! Unable to send your message. Please review your details and try again.";

      try {
        const result = await response.json();
        if (result.errors && result.errors.length) {
          const messages = result.errors.map(err => err.message).join(", ");
          if (messages && messages.trim() !== "") {
            userMessage = `Oops! ${messages}`;
          }
        }
      } catch {
        // Ignore JSON parsing errors; use default message
      }

      errorMessage.style.display = 'block';
      errorMessage.textContent = userMessage;

    } catch {
      loading.style.display = 'none';
      errorMessage.style.display = 'block';
      errorMessage.textContent = "Network error. Please check your connection and try again.";
    }
  });
});
