---
image: /assets/img/lego-dimensions.jpg
title: LDToypad.NET
skills: [.NET, C#, Hardware]
link: https://github.com/deathau/LDToypad.NET
summary: A .NET library for communicating with the LEGO Dimensions toypad
type: personal
---

This was a little bit more of a hack to see if I could, rathen than it being
something truly useful, but it is still pretty cool. I found other attempts to
do the same thing in other languages, but couldn't get anthing actually working.

Through a lot of reading, and some trial and error, I worked out how to communicate
with the toypad, and then wrote up a library that allows me to connect to it,
change the lights, and most importantly, read the physical tags placed on it.

The reason for doing this is to automate some things on my computer. As a proof
of concept, I made myself a little app that sits in the system tray. When I
place my Batman minifigure on the right panel of the toypad, my computer switches
to another remote desktop. Place him on the left, and I go back to the original
desktop. I also set up a custom Joker minifigure tag which, when placed in the
middle sport, will hibername my computer.

It's fun, but I've never gotten used to multiple desktops, so I rarely used it.
I ought to come up with some better ideas and hook it back up one of these days...