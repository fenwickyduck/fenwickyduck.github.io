# fenwickyduck.github.io

Personal site and blog. Built with [Hugo](https://gohugo.io) and a theme written
from scratch — no framework, no third-party JavaScript, no tracking, and no
requests off the origin. Fonts are self-hosted in `static/fonts/`.

## Design

Blueprint-grey ground, blue-cast ink, one ultramarine accent. Display type is
Newsreader, which also sets the body text; every label, date and tag is IBM
Plex Mono. Both self-hosted, latin subset, about 116 KB in total.

There's no illustration and no imagery. Hierarchy comes from scale, from the
contrast between a serif at reading size and small tracked-out monospace labels,
and from a lot of white space. The only colour beyond ink and paper is one
ultramarine accent, used on links, current-page markers and hover states.

## Editing the pages

Two files, and neither needs you to touch a template.

`content/_index.md` is the **home page**. The grey line under your name is the
`tagline` field in its front matter. Anything you write below the `---` appears
under that tagline. Your name itself is `title` in `hugo.toml`.

`content/about.md` is the **about page**. Ordinary markdown, except for the
key/value table near the bottom, which is plain HTML: copy a
`<div class="facts__row">` block to add a row, delete one to remove it.

Both files open with a comment explaining the same thing, so you don't have to
come back here.

## Writing a post

```sh
hugo new content writing/some-post-title.md
```

That creates a file from `archetypes/default.md`, pre-set to `draft: true`.
Write it, then flip `draft: false` (or delete the line) when it's ready.

## Hashtags

Put them in a post's front matter:

```yaml
tags: ["cryptography", "contest"]
```

Every tag gets its own page at `/tags/<name>/`, and `/writing/` carries a filter
strip listing all of them with counts. The strip appears on the tag pages too,
so you can move between filters without going back first. These are real links
to real URLs, which means each filtered view can be bookmarked and it all works
with JavaScript off.

Keep tags lower case and reuse existing ones where they fit. `capitalizeListTitles`
is off in `hugo.toml` so a tag page is titled `#meta`, not `#Meta`.

## Post front matter

```yaml
---
title: "Some post title"
date: 2026-08-12
draft: false
tags: ["cryptography"]                       # optional, see above
subtitle: "Optional line under the title."   # shown in the index too
toc: true                                    # optional table of contents
---
```

## Previewing locally

```sh
hugo server -D        # -D includes drafts; live-reloads on save
```

Then open <http://localhost:1313>.

`content/formatting-reference.md` exercises every element the theme styles:
headings, code, tables, quotes, maths, figures. It sits outside the writing
section and is a draft, so it appears in neither the index nor the feed. Open
`/formatting-reference/` after a CSS change to check nothing broke.

## Publishing

Push to `main`. The workflow in `.github/workflows/deploy.yml` builds with Hugo
and deploys to GitHub Pages. Nothing else to do.

**One-time setup:** in the repo's *Settings → Pages*, set **Source** to
**GitHub Actions**. Note that serving a user site from a *private* repo requires
GitHub Pro; if this repo is private and you're on the free plan, make it public.

## Layout of the repo

```
hugo.toml               site config: title, tagline, menu, links
archetypes/             template for new posts
content/
  _index.md             optional intro text on the home page
  about.md              /about/
  projects.md           /projects/
  writing/              blog posts live here
layouts/
  baseof.html           page shell
  home.html             home page
  page.html             single post / page
  list.html             /writing/ and tag pages
  404.html
  _partials/            head, header, footer, post list, tag bar, email
  _markup/              render hooks for links, images, headings
  _shortcodes/          {{< projects >}} / {{< project >}}
assets/
  css/main.css          the entire theme
  js/theme.js           light/dark toggle
static/fonts/           self-hosted woff2, latin subset (~116 KB total)
```

## Notes

- **Dates.** `timeZone` in `hugo.toml` is set to `Asia/Seoul`. Without it Hugo
  reads a date-only front matter value as UTC midnight, so a post dated today
  can look like it's in the future and silently not build. Change it if you move.
- **Colours and type** are CSS custom properties at the top of
  `assets/css/main.css`. Both light and dark palettes are defined there.
- **Prose spacing** comes from `.prose > * + *`, which is specificity (0,1,0).
  Don't reset margins with anything more specific (`.prose p { margin: 0 }` is
  (0,1,1)) — it wins regardless of order and silently closes the gaps between
  paragraphs.
- **Adding a project** to `/projects/`: copy a `{{</* project */>}}` block in
  `content/projects.md`.
- **Maths** is LaTeX: `$x$` inline, `$$x$$` for display. Hugo renders it to
  MathML while building, so no maths library or font reaches the reader.
- **The email address** is never written out. It lives as three separate params
  in `hugo.toml` and renders as `user [at] domain [dot] tld` via
  `layouts/_partials/email.html`. There's no `mailto:` on the site. Use
  `{{</* email */>}}` in any page that needs it.
