
# A widget that shows what's currently playing in either iTunes or Spotify.
# Assembled by Piotr Gajos
# https://github.com/Pe8er/Ubersicht-Widgets
# I don't know how to write code, so I obviously pulled pieces from all over the place, particularly from Chris Johnson's World Clock widget. Also big thanks to Josh "Baby Boi" Rutherford.

command: "osascript 'Playbox.widget/Get Current Track.scpt'"

refreshFrequency: 1000

style: """

  white06 = rgba(white,0.6)
  black02 = rgba(black,0.2)
  scale = 1
  bg-blur = 20px

  bottom: (58px + 8) * scale
  left: 8px * scale
  width: 325px * scale
  overflow: hidden
  white-space: nowrap
  opacity: 0

  .wrapper
    position: relative
    font-family: "Helvetica Neue"
    text-align: left
    font-size: 8pt * scale
    line-height: 12pt * scale
    -webkit-font-smoothing: antialiased
    color: white
    background: black02
    border: 1px * scale solid white06
    padding: (6px * scale) (12px * scale)
    height: 38px * scale

  .progress
    width: @width
    height: 2px * scale
    background: white06
    position: absolute
    bottom: 0
    left: 0

  .media-bg-slice
    position: absolute
    top: -2*(bg-blur)
    left: -2*(bg-blur)
    width: 100% + 6*bg-blur
    height: 100% + 6*bg-blur
    -webkit-filter: blur(bg-blur)

  .wrapper, .album
    overflow: hidden
    text-overflow: ellipsis

  .song
    font-weight: 700

  .song, .artist, .by
    display: inline

  .album, .by
    color: white06

  .rating
    float: right
    position: relative
  """

render: -> """
"""

# Update the rendered output.
update: (output, domEl) ->

  # Get our main DIV.
  div = $(domEl)

  # Get our pieces
  values = output.split(" ~ ")

  # Initialize our HTML.
  medianowHTML = ''

  # Progress bar things
  tDuration = values[4]
  tPosition = values[5]
  tWidth = $(domEl).width();
  tCurrent = (tPosition / tDuration) * tWidth

  # Make it disappear if nothing is playing
  if values[0] != 'Nothing playing'

    # Create the DIVs for each piece of data.
    $(domEl).animate({ opacity: 1 }, 500)
    medianowHTML = "
      <canvas class='media-bg-slice'></canvas>
      <div class='wrapper'>
        <div class='song'>" + values[1] + "</div>
        <div class='by'> by </div>
        <div class='artist'>" + values[0] + "</div>
        <div class='rating'>" + values[3] + "</div>
        <div class='album'>" + values[2] + "</div>
        <div class='progress'></div>
      </div>"
  else
    $(domEl).animate({ opacity: 0 }, 500)

  # Set the HTML of our main DIV.
  div.html(medianowHTML)

  if tDuration == 'NA'
    $(domEl).find('.progress').css width: "0"
  else
    $(domEl).find('.progress').css width: tCurrent

  afterRender: (domEl) ->
  uebersicht.makeBgSlice(el) for el in $(domEl).find '.media-bg-slice'