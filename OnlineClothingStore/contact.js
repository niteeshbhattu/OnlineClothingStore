// Initialize contact form
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return; // Not on contact page

  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const submitButton = document.getElementById('submit-button');
    const formData = new FormData(this);
    
    // Disable button and change text to indicate submission
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // Create a FormData object to collect form data
    const formValues = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };
    
    // Simulate form submission with a delay
    setTimeout(() => {
      // In a real application, this would be an AJAX request to send-message.php
      /*
      fetch('send-message.php', {
        method: 'POST',
        body: JSON.stringify(formValues),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        // Handle success
        showNotification('Message sent successfully! We\'ll get back to you soon.');
        contactForm.reset();
      })
      .catch(error => {
        // Handle error
        showNotification('Failed to send message. Please try again.', 'error');
      })
      .finally(() => {
        // Re-enable button and restore text
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      });
      */
      
      // For demo purposes, just show success and reset form
      showNotification('Message sent successfully! We\'ll get back to you soon.');
      contactForm.reset();
      
      // Re-enable button and restore text
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    }, 1500);
  });
}

// Initialize when DOM content is loaded
document.addEventListener('DOMContentLoaded', initContactForm);