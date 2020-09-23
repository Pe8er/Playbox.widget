
-- Setup `mypath`
try
  set mypath to POSIX path of (path to me)
  set AppleScript's text item delimiters to "/"
	set mypath to (mypath's text items 1 thru -2 as string) & "/"
	set AppleScript's text item delimiters to ""
on error e
  error "Couldn't set up mypath!" & e
end try

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

-- Reset .plist file on start
tell application "System Events"
  try
    tell property list file plist_filepath
      set value of property list item "album" to ""
      set value of property list item "artist" to ""
    end tell
  on error e
    error e
  end try
end tell

--- -- - SUBROUTINES - -- ---

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
