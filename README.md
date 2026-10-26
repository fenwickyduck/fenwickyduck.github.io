# fenwickyduck.github.io

Personal site and blog, built with [Hugo](https://gohugo.io).

## Writing a post

```sh
hugo new content writing/some-post-title.md
```

Posts start as drafts. Set `draft: false` when it's ready.

```yaml
---
title: "Some post title"
date: 2026-08-12
subtitle: "Optional line under the title."
description: "Optional summary for search results and link previews."
toc: true
---
```

Maths is LaTeX (`$x$` inline, `$$x$$` display) and is rendered to MathML at
build time.

## Running locally

```sh
hugo server -D
```

## Deploying

Pushing to `main` builds and deploys to GitHub Pages via
`.github/workflows/deploy.yml`.
