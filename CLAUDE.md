# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **Jekyll-based GitHub Pages blog** for tiankonguse (天空的代码世界), a Chinese technical blog covering algorithms, programming, investing, health, and life reflections.

## Development Commands

### Local Development Server

Start the Jekyll server with development configuration:

```bash
sudo jekyll serve --watch --config _config.yml,_config_dev.yml,_config_dev2.yml
```

Then access at:
- http://127.0.0.1 (primary)
- http://192.168.31.137 (local network testing)

### Build (without server)

```bash
jekyll build --config _config.yml
```

### Draft Workflow

Drafts are stored in `/draft/` (not `_drafts/`). To publish a draft:

```bash
# Move draft to posts with proper date prefix
mv draft/filename.md _posts/2026/03/2026-03-04-filename.md
```

## Architecture

### Configuration Hierarchy

- **`_config.yml`** - Base configuration with production settings (host: https://github.tiankonguse.com)
- **`_config_dev.yml`** - Local development overrides (host: 127.0.0.1)
- **`_config_dev2.yml`** - Alternative local config for 192.168.31.137 testing

Configurations are merged left-to-right: `_config.yml,_config_dev.yml,_config_dev2.yml`

### Directory Structure

| Directory | Purpose |
|-----------|---------|
| `_posts/` | Blog posts organized by year/month (e.g., `_posts/2026/01/`) |
| `_layouts/` | HTML templates (default.html, post.html, page.html) |
| `_includes/` | Reusable components (nav.md, sidenav.md, tags_list.md) |
| `_data/` | YAML data files (link.yml, nav.yml, book.yml, toppost.yml) |
| `_plugin/` | Ruby plugins for sitemap, categories, tags |
| `draft/` | Draft posts (manually managed, outside Jekyll's _drafts) |
| `javascripts/`, `stylesheets/`, `images/` | Static assets |

### Post Structure

Front matter template:
```yaml
---
layout: post
title: "Post Title"
description: "Brief description"
categories: [category1, category2]
tags: [tag1, tag2]
keywords: [keyword1, keyword2]
date: YYYY-MM-DD HH:MM:SS +0800
---
```

The site uses `permalink: /blog/:year/:month/:day/:title.html` format.

### Key Plugins (in `_plugin/`)

- **`sitemap_generator.rb`** - Generates sitemap.xml for SEO
- **`category_archive_plugin.rb`** - Category archive pages
- **`tag_page_generator.rb`** - Tag page generation
- **`raw_tag.rb`** - Raw content tag for Jekyll

### Data References

The site uses `site.data` extensively for reusable content:

- **`site.data.link`** - Common URLs (e.g., `{{ site.data.link.v8_intro }}`)
- **`site.data.nav`** - Top navigation menu
- **`site.data.toppost`** - Featured posts in sidebar
- **`site.data.book`** - Book recommendations

### Layout Hierarchy

```
default.html (base HTML structure)
├── post.html (blog posts, includes sidenav.md)
└── page.html (static pages)
```

Includes used in layouts:
- `nav.md` - Top navigation bar
- `sidenav.md` - Sidebar with WeChat QR, top posts, table of contents
- `follow.md` - Social follow buttons
- `scroll_top.md` - Back to top button

### Styling

- Main stylesheet: `stylesheets/default.css`
- Bootstrap 3.x for layout framework
- Pygments (Rouge) for code highlighting
- Font Awesome 4.3.0 for icons

## Important Configuration Notes

1. **Timezone**: Set to `Asia/Shanghai` for correct post dates
2. **Pagination**: 10 posts per page via `paginate: 10`
3. **Markdown**: kramdown with rouge highlighter
4. **Plugins used**: jemoji, jekyll-redirect-from, jekyll-sitemap
5. **Port**: Configured to port 80 (requires sudo)
6. **Keep files**: `/javascripts/`, `/stylesheets/`, `/images/` are preserved during build
