# AGENTS.md

Guidance for anyone, human or agent, editing codersfarm.org.

## What this is

The static site for codersfarm.org, served by Render from this repo's `main` branch. Merging to `main` publishes the site, so work on a branch and get the owner's review first.

It's built on a ThemeForest template (jQuery, Bootstrap, the template's `js/main.js`). There is no build step.

| Page | File |
|---|---|
| Home | `index.html` |
| Domovoi download page | `domovoi/index.html` |
| About and press kit | `about/index.html` |
| Privacy policy | `privacy/index.html` |
| Not found (Render serves it for missing paths) | `404.html` |

## Rules

- **Leave the template files alone**: `css/vendors.min.css`, `css/icon.min.css`, `css/style.css`, `css/responsive.css`, `css/elearning.css`, `js/jquery.js`, `js/vendors.min.js`, `js/main.js`. Put overrides in `css/site.css` and behavior in `js/site.js`.
- **The header and footer are copied into all five pages.** Change one, change all five. Inner pages use root-absolute paths (`/css/...`, `/images/...`); `index.html` uses relative ones.
- **Link to pages with a trailing slash**: `/domovoi/`, `/about/`, `/privacy/`.
- **In-page section links use `class="smooth-link"`**, not the template's `section-link`, whose scroller lands short on these pages. `js/site.js` also handles landing links such as `codersfarm.org/#domovoi`: the page loads at the top, then scrolls there.
- **Menu links must not use `/#section` for a section on the same page.** The template's `main.js` passes menu hrefs to jQuery as selectors, and `/#domovoi` throws, which stops every scroll animation on the page.
- **Template classes are not a full utility set.** Check that a class exists in the template CSS before using it (for example there is no `pt-180px`; use `inner-page-top` from `site.css`).
- **Images**: WebP for photos and screenshots, with `width`, `height` and `alt` set. Share images are 1200 × 630 JPGs in `images/`.
- **Placeholders** the owner must fill before launch use `class="owner-todo"` and an `<!-- OWNER: ... -->` comment. Search for `owner-todo` before going live.
- **Domovoi copy**: "Hey Domovoi" is fine; never claim "signed updates"; no emoji in Domovoi sections; amber `#F2A618` is the only accent there.

## On each Domovoi release

Update `domovoi/index.html`: the version and date, both APK file names and links, `DomovoiSetup.exe`'s link, and the sizes and SHA-256 values of all three from the release's `SHA256SUMS`, plus `softwareVersion` and `downloadUrl` in its JSON-LD. Update the quick facts on `about/index.html` if they name the version.

## Preview

```bash
python -m http.server 9922
```

Run it from this folder, then open http://localhost:9922. Port 8090 is reserved for something else on the owner's machine.

Python's server answers a missing path with its own plain error page; Render serves `404.html` instead. So a missing path looks different locally than on the live site; open /404.html to check the page itself.
