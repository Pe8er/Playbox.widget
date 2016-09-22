# Code originally created by the awesome members of Ubersicht community.
# I stole from so many I can't remember who you are, thank you so much everyone!
# Haphazardly adjusted and mangled by Pe8er (https://github.com/Pe8er)

options =
  # Easily enable or disable the widget.
  widgetEnable : true

  # Choose your widget.
  widgetVariant: "small"           # large | medium | small

  # Stick the widget in the corner? Set to *true* if you're using it with Sidebar widget, set to *false* if you'd like to give it some breathing room and a drop shadow.
  stickInCorner: true

  # Choose where the widget should sit on your screen.
  vPosition    : "bottom"           # top | bottom | center
  hPosition    : "left"             # left | right | center

command: "osascript 'Playbox.widget/as/Get Current Track.applescript'"
refreshFrequency: '1s'

style: """

  white05 = rgba(white,0.5)
  mainDimension = 176px
  transform-style preserve-3d

  // Let's sort out positioning.

  if #{options.stickInCorner} == false
    margin = 20px
    box-shadow 0 20px 50px 10px rgba(0,0,0,.6)
  else
    margin = 0

  if #{options.vPosition} == center
    top 50%
    transform translateY(-50%)
  else
    #{options.vPosition} margin

  if #{options.hPosition} == center
    left 50%
    transform translateX(-50%)
  else
    #{options.hPosition} margin


  // Different styles for different widget sizes.
  widgetVariant = #{options.widgetVariant}
  if widgetVariant == medium
    wScale = 0.75
    .album
      display none
  else
    wScale = 1


  // All the rest.

  width auto
  min-width 250px
  max-width mainDimension
  overflow hidden
  white-space nowrap
  display none
  position absolute
  -webkit-backdrop-filter blur(20px) brightness(60%) contrast(130%) saturate(140%)
  font-family system, -apple-system, "Helvetica Neue"

  .wrapper
    font-size 8pt
    line-height 11pt
    color white
    display flex
    flex-direction row
    justify-content flex-start
    flex-wrap nowrap
    align-items center

  .art
    width 64px
    height @width
    background-image url(Playbox.widget/as/default.png)
    -webkit-transition background-image 0.5s ease-in-out
    background-size cover

  .text
    left 64px
    margin 0 32px 0 8px

  .progress
    width @width
    height 2px
    background white
    position absolute
    bottom 0
    left 0

  .wrapper, .album, .artist, .song
    overflow hidden
    text-overflow ellipsis

  .album, .artist, .song
    max-width mainDimension

  .song
    font-weight 700

  .album
    color white05

  if widgetVariant == large or widgetVariant == medium
    min-width 0

    .wrapper
      flex-direction column
      justify-content flex-start
      flex-wrap nowrap
      align-items center

    .art
      width mainDimension * wScale
      height @width
      margin 0

    .text
      margin 8px
      float none
      text-align center
      max-width (mainDimension * wScale) - 20

    .progress
      top mainDimension * wScale
"""

options : options

render: (output) ->
  # Initialize our HTML.
  playboxHTML = ''

  # Create the DIVs for each piece of data.
  playboxHTML = "
    <div class='wrapper'>
      <div class='art'></div>
      <div class='text'>
        <div class='song'></div>
        <div class='artist'></div>
        <div class='album'></div>
      </div>
      <div class='progress'></div>
    </div>"

  return playboxHTML

# Update the rendered output.
update: (output, domEl) ->

  # Get our main DIV.
  div = $(domEl)

  if @options.widgetEnable

    # Initialize our HTML.
    playboxHTML = ''

    if output.length == 0
      div.animate {opacity: 0}, 250, 'swing'
      callback = -> div.hide()
      setTimeout callback, 250
    else
      values = output.slice(0,-1).split(" ~ ")
      div.find('.artist').html(values[0])
      div.find('.song').html(values[1])
      div.find('.album').html(values[2])
      tDuration = values[3]
      tPosition = values[4]
      tArtwork = values[5]
      tWidth = div.width()
      tCurrent = (tPosition / tDuration) * tWidth
      div.find('.progress').css width: tCurrent

      if tArtwork isnt "NA"
        div.find('.art').css('background-image', 'url('+tArtwork+')')

      div.show()
      div.animate {opacity: 1}, 250, 'swing'

    totalWidth = screen.width
    div.css('max-width', totalWidth)

    # Sort out flex-box positioning.
    # div.parent('div').css('order', '9')
    # div.parent('div').css('flex', '0 1 auto')
  else
    div.hide()
