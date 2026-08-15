# fenwickyduck.github.io

Personal site and blog. Built with [Hugo](https://gohugo.io) and a theme written
from scratch — no framework, no third-party JavaScript, no tracking, and no
requests off the origin. Fonts are self-hosted in `static/fonts/`.

## Design

Oat-sage paper, warm charcoal ink, one muted plum accent. Newsreader sets the
display and the reading text, with its italic on taglines and subtitles; IBM
Plex Mono handles dates and data, in sentence case. Six glyphs of Noto Serif KR
carry the hangul and hanja in the masthead. All self-hosted and cut down to
what the site actually sets, about 114 KB in total.

The home page opens on the name in three scripts on one line — `Seyoon Park`,
then hangul, then hanja — divided by the plum point the rest of the site uses
as its mark. The CJK is set at 0.82em because a matched point size doesn't
match: those glyphs fill their em box where the latin doesn't.

Every page opens over a lattice: a hexagonal field of points that thins out and
disappears before the reading text starts. It's drawn by two offset radial
gradients in `.lattice`, so it costs no request and no markup beyond one empty
`<div>`. In two dimensions that lattice is the densest packing there is, which
is roughly what this site is about.

The plum shows up in a few places and nowhere else: under the current nav item,
between the scripts in the masthead, and next to a post's date when you point
at it. Rows are separated by space rather than by rules, and the writing list
hangs its dates in the left margin once the window is wide enough to spare one.

The header is the same on every page, home included, and sticks to the top of
the window unless the window is too short to spare the room. It used to drop
the name on the home page, which meant the header changed shape as you moved
around the site.

On load, the name and the tagline rise into place while the lattice comes up
behind them. Nothing else on the site moves unless you touch it, and under
`prefers-reduced-motion` nothing moves at all.

Keep that sequence short if you change it. The masthead is the biggest thing on
the page, so while it's transparent the browser has painted nothing that counts
and Largest Contentful Paint is still waiting on it. Anything that photographs
the page rather than reading it catches whatever frame it lands on.

## The name

`hugo.toml` holds three pieces of it. The masthead sets them in that order,
hangul first and the latin in the middle:

```toml
nameKo    = "박세윤"          # under [params]
title     = "Seyoon Park"   # top level, not under [params]
nameHanja = "朴世阭"          # under [params]
```

Empty either CJK one and that part of the masthead disappears. The header and
the page titles only ever use `title`.

Shipping a CJK family for six characters would cost about 15 MB, so
`static/fonts/noto-serif-kr-*.woff2` is Noto Serif KR cut down to exactly the
characters above: 2 KB a weight. **Change the characters and the font has to be
recut**, or they'll fall back to whatever serif the reader happens to have:

```sh
./scripts/name-font.sh                    # uses the characters in the script
./scripts/name-font.sh '박세윤朴世阭 안녕'   # or pass your own
```

It fetches from Google, subsets, writes to `static/fonts/`, and fails loudly if
any character you asked for isn't in the font. Needs `pip install
'fonttools[woff]'`. Nothing is fetched at page-load time; readers only ever talk
to this origin.

## Editing the pages

Two files, and neither needs you to touch a template.

`content/_index.md` is the **home page**. The grey line under your name is the
`tagline` field in its front matter. Anything you write below the `---` appears
under that tagline. Your name itself lives in `hugo.toml`; see *The name* above.

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

`toc: true` needs at least three headings before anything appears; below that a
contents list is just the headings again. On a wide window it hangs in the left
margin and stays there as you scroll, on a narrow one it sits above the article
and folds away when you click the label. It shows h2 and h3, which is
`tocDepth` in `hugo.toml`.

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
scripts/
  name-font.sh          recuts the CJK subset for the masthead name
static/fonts/           self-hosted woff2 (~114 KB total)
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
- **Headings inside prose** are styled by `.prose h2, .prose h3, .prose h4`,
  which match *any* heading below `.prose`, not just direct children. A heading
  inside a shortcode gets the same 3 rem top margin unless it's targeted by a
  selector with two classes, which is why the project name is
  `.project-list .project__name`.
- **Adding a project** to `/projects/`: copy a `{{</* project */>}}` block in
  `content/projects.md`.
- **Maths** is LaTeX: `$x$` inline, `$$x$$` for display. Hugo renders it to
  MathML while building, so no maths library or font reaches the reader.
- **The email address** is never written out. It lives as three separate params
  in `hugo.toml` and renders as `user [at] domain [dot] tld` via
  `layouts/_partials/email.html`. There's no `mailto:` on the site. Use
  `{{</* email */>}}` in any page that needs it.
