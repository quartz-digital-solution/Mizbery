# MIZBERY — Complete customer website

This is a self-contained responsive customer website built in HTML, CSS and vanilla JavaScript. It is not a 3D website: every bottle displayed is an image. There is no backend, account system or admin panel.

## Use it

Open `index.html` in a browser for a local preview. To publish, upload the **contents** of this folder to a static host like Cloudflare Pages, Netlify or GitHub Pages. No build step is needed.

## Business contacts (IMPORTANT)

Edit `js/config.js`, and replace the blank `whatsapp`, `email`, and/or `phone` with the *actual* Mizbery business contact details. The number for WhatsApp must include the country code, using digits only. Until one is set, form submissions are copied locally rather than sent to a business. This avoids accidentally sending customers to an unverified number.

When WhatsApp is configured, the enquiry opens WhatsApp with the message prepared; customers must **press Send**. When email is configured instead, it opens the user's email application. This is a static site and therefore does not collect or store enquiries in a database.

## Branding and images

- `assets/logo-light.svg` / `assets/logo-dark.svg`: the source logo artwork is isolated from the user's tiny original JPG and embedded within an SVG file, rather than being replaced by a different symbol. **It is not a true editable vector logo**; a high-resolution official SVG supplied by Mizbery would produce the sharpest possible result.
- `assets/mizbery-hero.webp`: approved transparent product hero image.
- `assets/mizbery-bottle.webp`: transparent still image of the bottle extracted from the approved hero visual for product cards (representational illustration, not confirmed photos of each specific size).
- `assets/social-preview.jpg`: website sharing preview.

## Features

- White theme by default and pure black theme through toggle (remembered locally)
- Mobile navigation, FAQ accordions and product-linked enquiry form
- Contact selection, validation and copy/WhatsApp/mailto enquiry workflows
- Responsive desktop/tablet/mobile CSS, reduced-motion support, meta tags and accessible labels
- No external JS libraries, no canvas or WebGL and no 3D files

## Before going live

1. Add official business contact details in `js/config.js`.
2. Confirm that 500 ml, 1 litre, and bulk supply formats match Mizbery's actual product catalogue; update the product cards if not.
3. Replace approximated branding assets with official transparent vector assets if available.
4. Check wording, legal/compliance details, quality certificates, pricing and delivery coverage with Mizbery before making any claims.
5. Optionally host fonts locally for fully offline operation; Google Fonts loads from the internet at present, with system font fallbacks.

## v5 updates
- Four responsive product cards including a visual mock-up of a shrink-wrapped packed-water case. Images and packaging are illustrative, not confirmed factory SKUs.
- The final form button says 'Enquiry now'.
- A small confirmation animation indicates when a message is prepared, **not** that it has been delivered. Actual enquiries require configuring a business WhatsApp/email in js/config.js.


Version 7: packed-water product updated with transparent-background product image, default theme follows OS, manual theme changes saved.


## Install as an app (PWA)
Deploy the folder on HTTPS (such as Cloudflare Pages). Open the site in Chrome or Edge and use the browser Install app option. On Android use Install app/Add to Home screen; on iPhone Safari use Share > Add to Home Screen. Opening index.html directly from Downloads (file://) cannot register a service worker and is not sufficient for normal PWA installation. The app caches its static assets for offline viewing; sending enquiries still requires internet access and a configured contact method.

Version 9: new full Mizbery logo on white install icon, reduced header/footer logo, cache version bumped to v9. Deploy over HTTPS and refresh/reinstall to see icon changes.
