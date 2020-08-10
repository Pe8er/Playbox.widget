#!/usr/bin/osascript

-- Global vars
global playingState, appName, trackName, artistName, albumName, artworkURL, artworkFilename, trackDuration, mypath, artExtension

set spotifyInstalled to false
set playingState to false
set appName to ""
set trackName to ""
set artistName to ""
set albumName to ""
set artworkURL to ""
set artworkFilename to ""
set trackDuration to 0
set timeElapsed to 0

set artExtension to ""

--- -- - MAIN ROUTINE - -- ---
-- Setup `mypath`
try
  set mypath to POSIX path of (path to me)
  set AppleScript's text item delimiters to "/"
	set mypath to (mypath's text items 1 thru -2 as string) & "/"
	set AppleScript's text item delimiters to ""
on error e
  error "Couldn't set up mypath!" & e
end try

-- Check if Spotify is installed
try
  tell application "Finder" to get application file id "com.spotify.client"
  set spotifyInstalled to true
on error
  set spotifyInstalled to false
end try

-- Get Spotify track data if playing
if spotifyInstalled and application "Spotify" is running then
  tell application "Spotify"
    using terms from application "Music"
      if player state is playing then
        set playingState to true
        set appName to "Spotify"
      end if
    end using terms from

    if playingState is true then
      set trackName to the name of current track
      set artistName to the artist of current track
      set albumName to the album of current track
      set artworkURL to the artwork url of current track
      set trackDuration to the (duration of current track) / 1000
      set timeElapsed to the player position

      set artExtension to ".jpg"
    end if
  end tell
end if

-- Get Apple Music track data if playing
if playingState is false and application "Music" is running then
  tell application "Music"
    if player state is playing then
      set playingState to true
      set appName to "Music"
      set trackName to the name of current track
      set artistName to the artist of current track
      set albumName to the album of current track
      set artworkURL to ""
      set trackDuration to the duration of current track
      set timeElapsed to the player position

      if format of item 1 of artworks in current track is «class PNG » then
        set artExtension to ".png"
      else
        set artExtension to ".jpg"
      end if
    end if
  end tell
end if

set artworkFilename to generateArtFilename(albumName & "-" & artistName & artExtension as string)

-- Trigger extra changes if song changed
if playingState and my songChanged() then
  -- Setup local artwork filename and location
  set cache_file to (mypath & "cache/" & artworkFilename as string)

  if my fileExists(cache_file) is false then    -- If artwork isn't cached, download and cache it
    if appName is "Spotify" then
      my extractSpotifyArt()
    else if appName is "Music" then
      my extractMusicArt()
    end if
  else    -- Else, touch the cached file to keep it "fresh"
    set command to "touch \"./UeberPlayer.widget/cache/" & artworkFilename & "\""
    do shell script command
  end if
end if

-- Return results
set retList to {playingState, appName, trackName, artistName, albumName, artworkURL, artworkFilename, trackDuration, timeElapsed}
set AppleScript's text item delimiters to " @@ "
set retStr to retList as string
set AppleScript's text item delimiters to ""
return retStr

--- -- - SUBROUTINES - -- ---

-- Function to determine if a song changed happened
on songChanged()
  -- Use a .plist file to detect changes
  set plist_filepath to (mypath & "currentTrack.plist" as string)

  -- If .plist file doesn't exist, create it and return true (supposing this is a first-time run for the user)
  if fileExists(plist_filepath) is false then
    tell application "System Events"
      set the parent_dictionary to make new property list item with properties { kind:record }
      set plist_file to make new property list file with properties { contents: parent_dictionary, name: plist_filepath }
      tell property list items of plist_file
        make new property list item at end with properties { kind: string, name: "album", value: albumName }
        make new property list item at end with properties { kind: string, name: "artist", value: artistName }
      end tell
      return true
    end tell
  end if

  tell application "System Events"
    try
      tell property list file plist_filepath
        if (value of property list item "album" is not albumName) or (value of property list item "artist" is not artistName)
          set value of property list item "album" to albumName
          set value of property list item "artist" to artistName
          return true
        else
          return false
        end if
      end tell
    on error e
      error e
    end try
  end tell
end songChanged

-- Simple function to return if a file exists or not
on fileExists(f)
  tell application "System Events"
    if exists file f then
      return true
    else
      return false
    end if
  end tell
end fileExists

-- Generate a "safe" filename for cached artwork (no whitespace nor quotation marks)
on generateArtFilename(str)
  set charsToCheck to characters of str
  set retList to {}
  repeat with i from 1 to count charsToCheck
    if {charsToCheck's item i} is not in {" ", "\"", "/", ",", ":", "?"} then
      set retList's end to charsToCheck's item i
    end if
  end repeat
  return retList as string
end generateArtFilename

-- Extract artwork file from Spotify
on extractSpotifyArt()
  set command to "curl " & artworkURL & " --create-dirs -o \"./UeberPlayer.widget/cache/" & artworkFilename & "\""
  try
    do shell script command
  end try
end extractSpotifyArt

-- Extract artwork from Apple Music
on extractMusicArt()
  tell application "Music" to tell artwork 1 of current track
    set srcBytes to raw data
  end tell

  -- Use alternate way of getting the path because the other one doesn't work for some reason?
  set myAltPath to POSIX path of (path to me)
	set AppleScript's text item delimiters to "/"
	set myAltPath to (myAltPath's text items 1 thru -2 as string) & "/"
	set AppleScript's text item delimiters to ""
  set myAltPath to (myAltPath as POSIX file) & "cache:" & artworkFilename as string

  set outFile to open for access file myAltPath with write permission
  set eof outFile to 0
  write srcBytes to outFile starting at eof
  close access outFile
end extractMusicArt
