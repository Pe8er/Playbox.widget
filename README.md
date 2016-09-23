# Playbox for [Übersicht](http://tracesof.net/uebersicht/)

This widget shows currently played song in either iTunes or Spotify. It has a spiffy progress bar, shows pretty artwork (external dependency: pretty artwork) and has a ton of customization options.

## [Download Playbox](https://github.com/Pe8er/Playbox.widget/raw/master/Playbox.widget.zip)

# Features

<img src="https://github.com/Pe8er/Playbox.widget/blob/master/screenshot.jpg" width="516" height="320">

- Supports both Spotify and iTunes.
- Shows artwork (courtesy of [last.fm](http://www.last.fm)).
- Song progress bar.
- Three size variants.
- 🔥 Dark and light themes.
- 🔥 Position song metadata inside or outside the artwork.
- 🔥 If song meta is inside the artwork, it fades out automatically. Click the artwork to show it again.
- Easy way to toggle the widget's visibility.
- Easy way to position the widget on the screen.
- Spiffy fade animations all over the place.

# Options

Here's how you can set all the widget's options. Open `index.coffee` and look at the very top of the document:

```coffeescript
  # Enable or disable the widget.
  widgetEnable : true                   # true | false

  # Choose where the widget should sit on your screen.
  verticalPosition    : "bottom"        # top | bottom | center
  horizontalPosition    : "left"        # left | right | center

  # Choose widget size.
  widgetVariant: "large"                # large | medium | small

  # Choose color theme.
  widgetTheme: "dark"                   # dark | light

  # Song metadata inside or outside? Applies to large and medium variants only.
  metaPosition: "inside"                # inside | outside

  # Stick the widget in the corner? Set to *true* if you're using it with Sidebar widget, set to *false* if you'd like to give it some breathing room and a drop shadow.
  stickInCorner: false                  # true | false
```

## [Download Playbox](https://github.com/Pe8er/Playbox.widget/raw/master/Playbox.widget.zip)

[See my other widgets &rarr;](https://github.com/Pe8er/Ubersicht-Widgets)