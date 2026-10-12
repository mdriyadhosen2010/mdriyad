# Riyad: AI Automation Developer portfolio

A static website made of plain HTML, CSS, and JavaScript. No build tools, no frameworks, no backend.

## What is in this folder

```
riyad-portfolio/
  index.html                         The page: every section's text, projects, services, FAQ
  css/styles.css                     All styling. Colors, fonts, and spacing are at the top
  js/site-config.js                  YOUR SETTINGS: contact details, show/hide sections
  js/main.js                         Behavior: menu, FAQ, animations, contact links
  riyad-portfolio-single-file.html   Same site with CSS and JS inside one file (for hosting / Blogger work)
  build_single.py                    Optional script that regenerates the single-file version
```

## Run and preview

- Double-click `index.html`. It opens in your browser. No server needed.
- After editing a file, save it and refresh the browser tab.
- Internet is only needed for the Google Fonts (Space Grotesk and Inter). Without it, the site uses system fonts.

## Where to edit things

| What | Where |
| --- | --- |
| Email, WhatsApp, social links | `js/site-config.js` (replace each `[YOUR_...]` value) |
| Hide the pricing section or the testimonials block | `js/site-config.js`, set `pricing` / `testimonials` to `false` |
| Headline, hero text, button text | `index.html`, search for `id="hero-title"` |
| About text | `index.html`, search for `id="about-title"` |
| Services | `index.html`, search for `id="services"`. Copy or delete a `<article class="card service">` block |
| Pricing | `index.html`, search for `id="pricing"`. Replace `[Add Price]` and `[Define Scope]` |
| Projects | `index.html`, search for `id="projects"`. Copy or delete a `<article class="card project">` block |
| Testimonials | `index.html`, search for `id="testimonials"`. Add only real, verified ones |
| FAQ | `index.html`, search for `id="faq"` |
| Colors, fonts, spacing | `css/styles.css`, section "1. DESIGN TOKENS" |

Comments that start with `EDIT:` in `index.html` mark the places you are most likely to change.

Contact links stay switched off (shown with their placeholder, not clickable) until you add a valid value. Email must look like an address, WhatsApp must be a phone number with country code, and the others must start with `https://`.

### Adding a project demo link
Only when a real demo exists, add this inside the project's details area:
`<a class="text-link" href="https://your-real-demo-url">View demo</a>`

## Keeping the source safe
Keep this whole folder. Copy it to cloud storage and, ideally, a GitHub repository. The single-file version is also a complete copy of the site.

## Publishing as a normal website
Any static host works: upload the folder (or just the single-file version) to GitHub Pages, Netlify, or Cloudflare Pages.

## Adapting this to a Blogger XML theme (not done yet)

This project is **not** a Blogger theme yet. Blogger themes are a single XML file with its own rules, so a conversion and testing step is needed:

1. Start from `riyad-portfolio-single-file.html`.
2. Wrap it in Blogger's theme structure: the XML header, the `<html>` tag with the `b:`, `data:`, and `expr:` namespaces, and `<b:skin>` for the CSS.
3. The file must be valid XML. Close all tags (`<meta ... />`), turn `&` in text into `&amp;`, and put CSS and JavaScript inside `<![CDATA[ ... ]]>` blocks.
4. Blogger requires at least one `<b:section>` containing a Blog widget. Keep the portfolio markup in the template body and add the required section so the theme validates.
5. Replace `<title>` and the meta tags with Blogger's equivalents (`<data:blog.pageTitle/>` and `<b:include data='blog' name='all-head-content'/>`).
6. Upload in Blogger: Theme, then Edit HTML (back up the current theme first), and fix any validation errors it reports.
7. Check Blogger's mobile-template setting so phones receive this responsive layout.
8. Test every link, the menu, the FAQ, and the layout on a phone.

Things that need attention in conversion:
- Google Fonts are loaded from an external link (optional; system fonts are the fallback).
- The `<canvas>` background and the `IntersectionObserver` code are standard browser features but have not been tested inside Blogger.
- Blogger injects its own scripts and styles, which can conflict with page-level CSS.
- The contact settings live in `js/site-config.js`; after conversion they will sit in a `<script>` block in the theme.

## Honest status
- Contact links, pricing, and testimonials are placeholders until you fill them in.
- The seven projects are labeled sample demonstrations. Replace them with real details when verified.
- No Open Graph image is set; add `og:image` and `og:url` once the site has an address and a real image.
- Tested in headless Chromium only (desktop, tablet, and phone sizes). Not yet tested in Safari, Firefox, or on real devices, and not tested with a screen reader.
