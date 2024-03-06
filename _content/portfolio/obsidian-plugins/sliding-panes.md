---
image: https://github.com/deathau/sliding-panes-obsidian/raw/master/screenshot.gif
title: Sliding Panes (Andy Matuschak Mode)
type: obsidian-plugin
skills: [CSS, JavaScript, HTML]
link: https://github.com/deathau/sliding-panes-obsidian
summary: A unique way to view open panes in Obsidian
---

In early 2020, I found myself inspired to try and collect my thoughts in a
collection of linked notes. I was mostly inspired by [Andy Matuschak](https://notes.andymatuschak.org/)
and the way his notes website opened linked notes in columns, so you could see
where you'd been.

I did attempt to create my own similar thing for a bit, but then I discovered
[Obsidian](https://obsidian.md). It was pretty new at the time, but seemed to do
what I wanted in terms of linking notes together.

However, it didn't have the cool horizontal stacked notes thing that Andy Matuschak's
website had. However, based on my experiments with building a similar thing myself,
I thought I could modify the internal CSS of Obsidian to present notes in a similar
format. And it worked! Not only that, it was [pretty popular](https://forum.obsidian.md/t/170) with others!

Later in the year, the Obsidian team opened up their plugin API (which I helped
discuss with the devs) and I migrated my fun CSS tweak into a full-blown JavaScript
plugin. Doing so won me the inaugural [Best Plugin](https://obsidian.md/blog/2020-goty-winners/)
of the year in 2020.

The functionality has been since incorporated into the core of Obsidian. By using
the "stack tabs" option, you get vertically stacked notes that slide over each other,
just like I'd envisioned from Andy Matuschak's website.