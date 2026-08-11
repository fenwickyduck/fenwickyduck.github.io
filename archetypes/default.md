---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true

# Hashtags. Anything you put here becomes a filter on /writing/ and gets its
# own page at /tags/<name>/. Lower case, and reuse existing tags where they fit.
tags: []

# subtitle: "One line of context, shown under the title and in the index."
# toc: true
---
