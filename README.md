# Playbox for [Übersicht](http://tracesof.net/uebersicht/)

This widget shows currently played song in either iTunes or Spotify. It has a spiffy progress bar, shows pretty artwork (external dependency: pretty artwork) and has _a few_ customization options.

## [Download Playbox](https://github.com/Pe8er/Playbox.widget/releases/latest)

# Features

<img src="https://github.com/Pe8er/Playbox.widget/blob/master/screenshot.jpg" width="516" height="320">

- Supports both Spotify and iTunes.
- Shows artwork (courtesy of [last.fm](http://www.last.fm) or local artwork for iTunes songs or Spotify API.)
- Progress bar.
- Three sizes.
- 🔥 Dark and light themes.
- Easy way to position the widget on the screen.

# Options

Here's how you can set all the widget's options. Open `index.coffee` and look at the very top of the document:

```coffeescript
  # Choose where the widget should sit on your screen.
  verticalPosition    : "bottom"        # top | center | bottom
  horizontalPosition    : "left"        # left | center | right

  # Choose widget size.
  widgetSize: "medium"                  # big | medium | smol

  # Choose color theme.
  widgetTheme: "dark"                   # dark | light

  # Stick the widget in the corner? It removes round corners and shadows for a flat, minimalist setup.
  stickInCorner: false                  # true | false
```

## [Download Playbox](https://github.com/Pe8er/Playbox.widget/releases/latest)
