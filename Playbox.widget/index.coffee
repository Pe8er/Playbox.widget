# Code originally created by the awesome members of Ubersicht community.
# I stole from so many I can't remember who you are, thank you so much everyone!
# Haphazardly adjusted and mangled by Pe8er (https://github.com/Pe8er)

options =
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

command: "osascript 'Playbox.widget/lib/Get Current Track.applescript'"
refreshFrequency: '1s'

style: """

  // Let's do theming first.

  if #{options.widgetTheme} == dark
    fColor = white
    bgColor = black
    bgBrightness = 80%
  else
    fColor = black
    bgColor = white
    bgBrightness = 120%

  // Specify color palette and blur properties.

  fColor1 = rgba(fColor,1.0)
  fColor08 = rgba(fColor,0.8)
  fColor05 = rgba(fColor,0.5)
  fColor02 = rgba(fColor,0.2)
  bgColor1 = rgba(bgColor,1.0)
  bgColor08 = rgba(bgColor,0.7)
  bgColor05 = rgba(bgColor,0.5)
  bgColor02 = rgba(bgColor,0.2)
  blurProperties = blur(10px) brightness(bgBrightness) contrast(100%) saturate(140%)

  // Next, let's sort out positioning.

  if #{options.stickInCorner} == false
    margin = 20px
    box-shadow 0 20px 40px 0px rgba(0,0,0,.6)
    border-radius 6px
    .text
      border-radius 0 0 6px 6px
  else
    margin = 0

  if #{options.stickInCorner} == false and #{options.widgetVariant} != small
    .art
      border-radius 6px

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

  display none
  position absolute
  transform-style preserve-3d
  -webkit-transform translate3d(0px, 0px, 0px)
  mainDimension = 176px
  width auto
  min-width 200px
  max-width mainDimension
  overflow hidden
  white-space nowrap
  background-color bgColor02
  font-family system, -apple-system, "Helvetica Neue"
  border none
  -webkit-backdrop-filter blurProperties
  z-index 10

  .wrapper
    font-size 8pt
    line-height 11pt
    color fColor1
    display flex
    flex-direction row
    justify-content flex-start
    flex-wrap nowrap
    align-items center
    overflow hidden
    z-index 1

  .art
    width 64px
    height @width
    background-color fColor05
    background-image url(/Playbox.widget/lib/default.png)
    background-size cover
    z-index 2

  .text
    left 64px
    margin 0 32px 0 8px
    max-width mainDimension
    z-index 3

  .progress
    width @width
    height 2px
    background fColor1
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
    top 4px
    #{options.horizontalPosition} @top
    font-size 16px

  // Different styles for different widget sizes.

  if #{options.widgetVariant} == medium
    Scale = 0.75

    .wrapper
      font-size 8pt !important
      line-height 10pt !important

    .album
      display none

    .heart
      font-size 12px !important
  else
    Scale = 1

  if #{options.widgetVariant} == large or #{options.widgetVariant} == medium

    min-width 0

    .wrapper
      flex-direction column
      justify-content flex-start
      flex-wrap nowrap
      align-items center

    .art
      width mainDimension * Scale
      height @width
      margin 0

    .text
      margin 8px
      float none
      text-align center
      max-width (mainDimension * Scale) - 20

    if #{options.metaPosition} == outside
      .progress
        top mainDimension * Scale
      .art
        border-radius 6px 6px 0 0

    if #{options.metaPosition} == inside
      background-color black
      -webkit-backdrop-filter none

      .wrapper
        overflow hidden

      .text
        // Blurred background is turned off because of insane WebKit glitches :(
        //-webkit-backdrop-filter blurProperties
        position absolute
        bottom 0
        left 0
        margin 0
        padding 8px
        color fColor1
        background-color bgColor08
        width mainDimension * Scale
        max-width @width
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

  if @options.metaPosition is 'inside' and @options.widgetVariant isnt 'small'
    meta.delay(3000).fadeOut(500)

    div.click(
      =>
        meta.stop(true,false).fadeIn(250).delay(3000).fadeOut(500)
        if @options.stickInCorner is false
          div.stop(true,true).animate({zoom: '0.99', boxShadow: '0 0 2px rgba(0,0,0,1.0)'}, 200, 'swing')
          div.stop(true,true).animate({zoom: '1.0', boxShadow: '0 20px 40px 0px rgba(0,0,0,0.6)'}, 300, 'swing')
          # div.find('.wrapper').stop(true,true).addClass('pushed')
          # div.find('.wrapper').stop(true,true).removeClass('pushed')
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
    currArt = "/" + div.find('.art').css('background-image').split('/').slice(-3).join().replace(/\,/g, '/').slice(0,-1)
    tWidth = div.width()
    tCurrent = (tPosition / tDuration) * tWidth
    div.find('.progress').css width: tCurrent
    # console.log(tArtwork + ", " + currArt)

    div.show(1).animate({opacity: 1}, 250, 'swing')

    if currArt isnt tArtwork and tArtwork isnt 'NA'
      artwork = div.find('.art')
      artwork.css('background-image', 'url('+tArtwork+')')

      # console.log("Changed to: " + tArtwork)

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

    if songChanged is 'true' and @options.metaPosition is 'inside' and @options.widgetVariant isnt 'small'
      div.find('.text').fadeIn(250).delay(3000).fadeOut(500)

    if isLoved is 'true'
      div.find('.heart').show()
    else
      div.find('.heart').hide()

  div.css('max-width', screen.width)

  # Sort out flex-box positioning.
  # div.parent('div').css('order', '9')
  # div.parent('div').css('flex', '0 1 auto')
