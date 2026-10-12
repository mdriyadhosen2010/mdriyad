/* ==========================================================================
   SITE SETTINGS: the file you edit most often
   --------------------------------------------------------------------------
   1. Replace each "[YOUR_...]" value with your real detail, inside the quotes.
   2. Leave a value as it is if you do not have it yet. That link will stay
      switched off and show its placeholder, so visitors never hit a broken link.
   3. Save the file and reload the page.

   Format rules
     email      a normal address:           "name@example.com"
     whatsapp   number with country code:   "+8801XXXXXXXXX"  (spaces are fine)
     others     the full profile address:   "https://www.linkedin.com/in/your-name"
                (must start with https://)
   ========================================================================== */
window.SITE_CONFIG = {

  contact: {
    email:    "[YOUR_EMAIL]",
    whatsapp: "[YOUR_WHATSAPP_NUMBER]",
    github:   "[YOUR_GITHUB_URL]",
    linkedin: "[YOUR_LINKEDIN_URL]",
    fiverr:   "[YOUR_FIVERR_URL]",
    youtube:  "[YOUR_YOUTUBE_URL]",
    facebook: "[YOUR_FACEBOOK_URL]",
    x:        "[YOUR_X_URL]"
  },

  /* Set to false to remove a section (and its menu links) from the page. */
  sections: {
    pricing: true,        // the "Packages" section
    testimonials: true    // the "Client feedback" block
  },

  /* Text used to pre-fill messages when a visitor clicks an email or WhatsApp link. */
  messages: {
    greeting: "Hi Riyad,",
    emailSubject: "Automation inquiry",
    whatsappDefault: "I'd like to talk about automating a process."
  }
};
