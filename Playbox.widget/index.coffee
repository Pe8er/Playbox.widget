# Code originally created by the awesome members of Ubersicht community.
# I stole from so many I can't remember who you are, thank you so much everyone!
# Haphazardly adjusted and mangled by Pe8er (https://github.com/Pe8er)

options =
  # Choose where the widget should sit on your screen.
  verticalPosition    : "bottom"        # top | center | bottom
  horizontalPosition    : "left"        # left | center | right

  # Choose widget size.
  widgetSize: "medium"                  # big | medium | smol

  # Choose color theme.
  widgetTheme: "dark"                   # auto | dark | light

  # Stick the widget in the corner? It removes round corners and shadows for a flat, minimalist setup.
  stickInCorner: false                  # true | false

command: "osascript 'Playbox.widget/lib/get current track.applescript'"
refreshFrequency: '1s'

style: """

  // Let's do theming first.

  if #{options.widgetTheme} == dark
    fColor = white
    bgColor = black
    bgBrightness = 80%
    bgContrast = 100%
  else
    fColor = black
    bgColor = white
    bgBrightness = 150%
    bgContrast = 50%

  // Global scaling for large and medium variants.

  if #{options.widgetSize} == big
    scale = 1
  else
    scale = 0.75

  // Aesthetics: Color palette and blur properties.

  fColor1 = rgba(fColor,1.0)
  fColor05 = rgba(fColor,0.5)
  fColor02 = rgba(fColor,0.2)
  bgColor1 = rgba(bgColor,1.0)
  bgColor05 = rgba(bgColor,0.5)
  bgColor02 = rgba(bgColor,0.2)

  blurProperties = blur(16px) brightness(bgBrightness) contrast(bgContrast) saturate(140%)

  // Stick in corner styling.

  if #{options.stickInCorner} == false
    margin = 16pt
    borderRadius = 8pt * scale
    box-shadow 0 24pt 32pt 0 rgba(0,0,0,.4)
    border-radius borderRadius
    .text
      border-radius 0 0 borderRadius borderRadius
  else
    margin = 0
    borderRadius = 0
    .text
      border-radius 0

  if #{options.stickInCorner} == false and #{options.widgetSize} != smol
    .art
      border-radius borderRadius


  // Positioning magic.

  if #{options.verticalPosition} == center
    top 50%
    transform translateY(-50%)
  else
    #{options.verticalPosition} margin
  if #{options.horizontalPosition} == center
    left 50%
    transform translateX(-50%)
  else
    #{options.horizontalPosition} margin


  // Misc styles.

  *, *:before, *:after
    box-sizing border-box

  mainDimension = 144pt
  display none
  position absolute
  transform-style preserve-3d
  -webkit-transform translate3d(0, 0, 0)
  width @mainDimension
  overflow hidden
  white-space nowrap
  background-color black
  font-family system, -apple-system, "Helvetica Neue"
  font-size 8pt
  line-height 11pt
  border none
  -webkit-backdrop-filter blurProperties
  z-index 10

  .wrapper
    color fColor1
    display flex
    flex-direction row
    justify-content flex-start
    flex-wrap nowrap
    align-items center
    overflow hidden
    z-index 1

  .art
    width 48pt
    height @width
    background-color fColor05
    background-image url(/Playbox.widget/lib/default.png)
    background-size cover
    z-index 2

  .text
    left 64pt
    margin 0 32pt 0 8pt
    max-width mainDimension
    z-index 3

  .progress
    width @width
    height 1pt
    background-color fColor1
    position absolute
    bottom 0
    left 0
    z-index 4

  .wrapper, .album, .artist, .song
    overflow hidden
    text-overflow ellipsis

  .album, .artist, .song
    max-width mainDimension

  .song
    font-weight 700

  .album
    color fColor05

  .heart
    position absolute
    color white
    top 4pt * scale
    #{options.horizontalPosition} @top
    font-size 16pt * scale


  // Different styles for different widget sizes.

  if #{options.widgetSize} == medium
    .album
      display none

  if #{options.widgetSize} == big or #{options.widgetSize} == medium

    min-width 0

    .wrapper
      flex-direction column
      justify-content flex-start
      flex-wrap nowrap
      align-items center

    .art
      width mainDimension * scale
      height @width
      margin 0

    .text
      position absolute
      float none
      text-align center
      width mainDimension * scale
      max-width @width
      bottom 0
      left 0
      margin 0
      color fColor1
      background-color none
      padding 6pt * scale
      -webkit-backdrop-filter blurProperties

"""

options : options

render: () -> """
  <div class="wrapper">
    <div class="progress"></div>
    <div class="art"><span class="heart">&#9829;</span></div>
    <div class="text">
      <div class="song"></div>
      <div class="artist"></div>
      <div class="album"></div>
    </div>
  </div>
  """

afterRender: (domEl) ->
  $.getScript "Playbox.widget/lib/jquery.animate-shadow-min.js"
  div = $(domEl)

  meta = div.find('.text')

  if @options.verticalPosition is 'center'
    div.css('top', (screen.height - div.height())/2)
  if @options.horizontalPosition is 'center'
    div.css('left', (screen.width - div.width())/2)

  if @options.widgetSize isnt 'smol'
    meta.delay(3000).fadeOut(500)

    div.on 'click', =>
      (
        meta.fadeIn(250).delay(3000).fadeOut(500)
        # if @options.stickInCorner is false
        #   div.stop(true,true).animate({zoom: '0.9', boxShadow: '0 0 2px rgba(0,0,0,1.0)'}, 300, 'swing')
        #   div.stop(true,true).animate({zoom: '1.0', boxShadow: '0 20px 40px 0px rgba(0,0,0,0.6)'}, 500, 'swing')
        # Update
    )

# Update the rendered output.
update: (output, domEl) ->

  # Get our main DIV.
  div = $(domEl)

  if !output
    div.animate({opacity: 0}, 250, 'swing').hide(1)
  else
    values = output.slice(0,-1).split(" @ ")
    div.find('.artist').html(values[0])
    div.find('.song').html(values[1])
    div.find('.album').html(values[2])
    tDuration = values[3]
    tPosition = values[4]
    tArtwork = values[5]
    songChanged = values[6]
    isLoved = values[7]
    darkMode = values[8]
    currArt = "/" + div.find('.art').css('background-image').split('/').slice(-3).join().replace(/\,/g, '/').slice(0,-1)
    tWidth = div.width()
    tCurrent = (tPosition / tDuration) * tWidth
    div.find('.progress').css width: tCurrent
    # console.log(tArtwork + ", " + currArt)

    div.show(1).animate({opacity: 1}, 250, 'swing')

    if currArt isnt tArtwork and tArtwork isnt 'NA'
      artwork = div.find('.art')
      artwork.css('background-image', 'url('+tArtwork+')')

      # Trying to fade the artwork on load, failing so far.
      # if songChanged is 'true'
        # artwork.fadeIn(100)
        # artwork.
        # artwork.fadeIn(500)

      # artwork = div.find('.art')
      # img = new Image
      # img.onload = ->
      #   artwork.css
      #     'background-image': 'url(' + tArtwork + ')'
      #     'background-size': 'contain'
      #   artwork.fadeIn 300
      #   return

      # img.src = tArtwork
      # return
    else if tArtwork is 'NA'
      artwork = div.find('.art')
      artwork.css('background-image', 'url(/Playbox.widget/lib/default.png)')

    if songChanged is 'true' and @options.widgetSize isnt 'smol'
      div.find('.text').fadeIn(250).delay(3000).fadeOut(500)

    if isLoved is 'true'
      div.find('.heart').show()
    else
      div.find('.heart').hide()

    if @options.widgetTheme is 'auto'
      if darkMode is 'true'
        @options.widgetTheme = 'dark'
      else
        @options.widgetTheme = 'light'



  div.css('max-width', screen.width)
