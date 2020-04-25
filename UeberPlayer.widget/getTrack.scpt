#!/usr/bin/osascript

-- Global vars
global playingState, appName, trackName, artistName, albumName, artworkURL, artworkFilename, trackDuration, artworkExtension

set playingState to false
set appName to ""
set trackName to ""
set artistName to ""
set albumName to ""
set artworkURL to ""
set artworkFilename to ""
set trackDuration to 0
set timeElapsed to 0

set artworkExtension to ""

--- -- - MAIN ROUTINE - -- ---
-- Setup
try
  set mypath to POSIX path of (path to me)
  set AppleScript's text item delimiters to "/"
	set mypath to (mypath's text items 1 thru -2 as string) & "/"
	set AppleScript's text item delimiters to ""
on error e
  error "Something happened!"
end try

-- Get Spotify track data
if application "Spotify" is running then
  tell application "Spotify"
    if the player state is playing then
      set playingState to true
      set appName to "Spotify"
      set trackName to the name of current track
      set artistName to the artist of current track
      set albumName to the album of current track
      set artworkURL to the artwork url of current track
      set trackDuration to the (duration of current track) / 1000
      set timeElapsed to the player position

      set artworkExtension to "jpg"
    end if
  end tell
end if

-- Get Apple Music track data
if playingState is false and application "Music" is running then
  tell application "Music"
    if the player state is playing then
      set playingState to true
      set appName to "Music"
      set trackName to the name of current track
      set artistName to the artist of current track
      set albumName to the album of current track
      set artworkURL to ""
      set trackDuration to the duration of current track
      set timeElapsed to the player position

      if format of item 1 of artworks in current track is «class PNG » then
        set artworkExtension to "png"
      else
        set artworkExtension to "jpg"
      end if
    end if
  end tell
end if

if playingState then
  if my songChanged() then
    set artworkFilename to generateArtFilename((albumName & artistName & "." & artworkExtension as string))
    set cache_file to (mypath & "cache/" & artworkFilename as string)

    if my fileExists(cache_file) is false then
      if appName is "Spotify" then
        my extractSpotifyArt(artworkFilename)
      else if appName is "Music" then
        my extractMusicArt(artworkFilename)
      end if
    end if
  end if
end if

-- Return results
set retList to {playingState, appName, trackName, artistName, albumName, artworkURL, artworkFilename, trackDuration, timeElapsed}
set AppleScript's text item delimiters to " @@ "
set retStr to retList as string
set AppleScript's text item delimiters to ""
return retStr

--- -- - SUBROUTINES - -- ---

on songChanged()
  return true
end songChanged

on fileExists(f)
	try
		POSIX file myfile as alias
		return true
	on error
		return false
	end try
end fileExists

on generateArtFilename(str)
  set charsToCheck to characters of str
  set retList to {}
  repeat with i from 1 to count charsToCheck
    if {charsToCheck's item i} is not in {" ", "\""} then
      set retList's end to charsToCheck's item i
    end if
  end repeat
  return retList as string
end generateArtFilename

on extractSpotifyArt(filename)
  set command to "curl " & artworkURL & " --create-dirs -o \"./UeberPlayer.widget/cache/" & filename & "\""
  do shell script command
end extractSpotifyArt

on extractMusicArt(filename)
  tell application "Music" to tell artwork 1 of current track
    set srcBytes to raw data
  end tell

  set mypath to POSIX path of (path to me)
	set AppleScript's text item delimiters to "/"
	set mypath to (mypath's text items 1 thru -2 as string) & "/"
	set AppleScript's text item delimiters to ""
  set mypath to (mypath as POSIX file) & "cache:" & filename as string

  set outFile to open for access file mypath with write permission
  set eof outFile to 0
  write srcBytes to outFile starting at eof
  close access outFile
end extractMusicArt
