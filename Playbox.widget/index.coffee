# I stole from so many I can't remember who you are, thank you so much everyone!
# Haphazardly adjusted and mangled by Pe8er (https://github.com/Pe8er)

options =
  # Easily enable or disable the widget.
  widgetEnable : true

  # Choose your widget.
  widgetVariant: "medium"           # large | medium | small

  # Choose where the widget should sit on your screen.
  vPosition    : "bottom"           # top | bottom | center
  hPosition    : "left"             # left | right | center

command: "osascript 'Playbox.widget/as/Get Current Track.applescript'"
refreshFrequency: '1s'

style: """

  // A few useful variables.
  white05 = rgba(white,0.5)
  margin = 20px
  transform-style preserve-3d

  // Let's sort out positioning.
  vPos = #{options.vPosition}
  hPos = #{options.hPosition}

  if vPos == center
    top 50%
    transform translateY(-50%)
  else
    #{options.vPosition} margin

  if hPos == center
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
  min-width 200px
  overflow hidden
  white-space nowrap
  opacity 0
  display none
  position absolute
  box-shadow 0 20px 50px 10px rgba(0,0,0,.6)
  -webkit-backdrop-filter blur(20px) brightness(60%) contrast(130%) saturate(140%)

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
      width 200px * wScale
      height @width
      margin 0

    .text
      margin 8px
      float none
      text-align center
      max-width (200px * wScale) - 20

    .progress
      top 200px * wScale
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
      setTimeout callback, 1000
    else
      div.show()
      callback = -> div.animate {opacity: 1}, 250, 'swing'
      setTimeout callback, 1000

      values = output.slice(0,-1).split(" ~ ")
      tDuration = values[4]
      tPosition = values[5]
      tArtwork = values[6]
      tWidth = div.width()
      tCurrent = (tPosition / tDuration) * tWidth
      currArt = div.find('.art').css('background-image').split('/').pop().slice(0,-1)
      div.find('.song').html(values[1])
      div.find('.artist').html(values[0])
      div.find('.album').html(values[2])
      div.find('.progress').css width: tCurrent

      if tArtwork isnt currArt
        if tArtwork =='NA'
          div.find('.art').css('background-image', 'url(Playbox.widget/as/default.png)')
        else
          div.find('.art').css('background-image', 'url('+tArtwork+')')

    totalWidth = screen.width
    div.css('max-width', totalWidth)
  else
    div.hide()
