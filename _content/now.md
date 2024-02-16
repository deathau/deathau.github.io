# What am I up to these days? {.p-name}

(This is my [now page](/now), and if you have your own site, [you should make one](https://nownownow.com/about), too.) {.small .muted}

{{ now.text | safe }}

---

### What I’m playing
{{ now.playing | safe }}

### What I’m <span title="or listening to as an audiobook">reading</span>
{{ now.reading | safe }}

### What I’m watching
{{ now.watching | safe }}

### What I’m making
{{ now.making | safe }}

### What I’m exploring
{{ now.exploring | safe }}

---

- Last updated: <time class="dt-updated" datetime="{{ now.modified | dateISOString }}">{{ now.modified | formatDate }}</time> {.fa-clock}