// Formspree Configuration
// To set up: Go to https://formspree.io, create a free account, create a form,
// and replace YOUR_FORM_ID below with your actual form ID (e.g., "xrgvabcd")

const FORMSPREE_FORM_ID = 'YOUR_FORM_ID'; // Replace this!

// Form action URL - used by all forms on the site
const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

// Export for use (if needed)
window.FORMSPREE_URL = FORMSPREE_URL;
