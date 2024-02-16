# What am I up to these days? {.p-name}

(This is my [now page](/now), and if you have your own site, [you should make one](https://nownownow.com/about), too.) {.small .muted}

{{ now.content | safe }}

---

- Last updated: <time class="dt-updated" datetime="{{ now.modified | dateISOString }}">{{ now.modified | formatDate }}</time> {.fa-clock}