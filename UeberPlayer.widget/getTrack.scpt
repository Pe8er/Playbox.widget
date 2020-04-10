#!/usr/bin/osascript

# Global vars
set playingState to false
set trackName to ""
set artistName to ""
set albumName to ""
set artworkURL to ""
set trackDuration to 0
set timeElapsed to 0

# Spotify
if application "Spotify" is running then
  tell application "Spotify"
    if the player state is playing then
      set playingState to true
      set trackName to the name of current track
      set artistName to the artist of current track
      set albumName to the album of current track
      set artworkURL to the artwork url of current track
      set trackDuration to the (duration of current track) / 1000
      set timeElapsed to the player position
    end if
  end tell
end if

# Log results
log playingState
if playingState then
  log trackName
  log artistName
  log albumName
  log artworkURL
  log trackDuration
  log timeElapsed
end if
