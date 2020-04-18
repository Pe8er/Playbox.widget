#!/usr/bin/osascript

-- Global vars
set playingState to false
set playingApp to ""
set trackName to ""
set artistName to ""
set albumName to ""
set artworkURL to ""
set artworkExtension to ""
set trackDuration to 0
set timeElapsed to 0

if application "Spotify" is running then      -- Spotify
  tell application "Spotify"
    if the player state is playing then
      set playingApp to "Spotify"
      set playingState to true
      set trackName to the name of current track
      set artistName to the artist of current track
      set albumName to the album of current track
      set artworkURL to the artwork url of current track
      set artworkExtension to "jpg"
      set trackDuration to the (duration of current track) / 1000
      set timeElapsed to the player position
    end if
  end tell
end if

if application "Music" is running then   -- Music
  tell application "Music"
    if the player state is playing then
      set playingApp to "Music"
      set playingState to true
      set trackName to the name of current track
      set artistName to the artist of current track
      set albumName to the album of current track
      set artworkURL to "local"

      if format of item 1 of artworks in current track is «class PNG » then
        set artworkExtension to "png"
      else
        set artworkExtension to "jpg"
      end if

      set trackDuration to the duration of current track
      set timeElapsed to the player position
    end if
  end tell
end if

-- Log results
log playingState
if playingState then
  log playingApp
  log trackName
  log artistName
  log albumName
  log artworkURL
  log artworkExtension
  log trackDuration
  log timeElapsed
end if
