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
  verticalPosition    : "bottom"        # top | bottom | center
  horizontalPosition    : "left"        # left | right | center

  # Choose widget size.
  widgetVariant: "large"                # large | medium | small

  # Choose color theme.
  widgetTheme: "dark"                   # dark | light

  # Song metadata inside or outside? Applies to large and medium variants only.
  metaPosition: "mixed"                # inside | outside | mixed

  # Stick the widget in the corner? Set to *true* if you're using it with Sidebar widget, set to *false* if you'd like to give it some breathing room and a drop shadow.
  stickInCorner: false                  # true | false
```

## [Download Playbox](https://github.com/Pe8er/Playbox.widget/releases/latest)
