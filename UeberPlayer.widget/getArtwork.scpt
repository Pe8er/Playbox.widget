#!/usr/bin/osascript

on run argv
  -- Error out if not calling the script correctly
  if (count of argv) is not 4 then
    log false
    return
  end if

  -- Get arguments
  set appName to item 1 of argv
  set filename to item 2 of argv
  set artworkURL to item 3 of argv
  set ext to item 4 of argv

  tell application "Finder"
    -- Get path to the cache
    set current_path to ((POSIX path of (container of (path to me) as text)) & "cache/" & filename) as string

    -- If the album artwork image does not exist, cache it
    if my fileExists(current_path) is false then
      if appName is "Spotify" then   -- Spotify: Download from URL
        set command to "curl " & artworkURL & " --create-dirs -o \"./UeberPlayer.widget/cache/" & filename & "\""
        do shell script command
      else      -- Music: Extract and cache from Music
        my extractFromMusic(filename)
      end if

      log false
      return
    end if
  end tell
  log true
end run

-- Function to check if a file exists
on fileExists(f)
  tell application "System Events"
    if exists file f then
      return true
    else
      return false
    end if
  end tell
end fileExists

-- Function to extract album artwork from Music and cache it
on extractFromMusic(f)
  tell application "Music" to tell artwork 1 of current track
    set srcBytes to raw data
  end tell

  set mypath to POSIX path of (path to me)
	set AppleScript's text item delimiters to "/"
	set mypath to (mypath's text items 1 thru -2 as string) & "/"
	set AppleScript's text item delimiters to ""
  set mypath to (mypath as POSIX file) & "cache:" & f as string

  set outFile to open for access file mypath with write permission
  set eof outFile to 0
  write srcBytes to outFile starting at eof
  close access outFile
end extractFromMusic
