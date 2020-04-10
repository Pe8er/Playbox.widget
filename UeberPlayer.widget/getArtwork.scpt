#!/usr/bin/osascript

on run argv
  if (count of argv) is not 2 then
    log false
    return
  end if

  set artworkURL to item 1 of argv
  set filename to item 2 of argv

  tell application "Finder"
    set current_path to ((POSIX path of (container of (path to me) as text)) & "cache/" & filename) as string

    if my fileExists(current_path) is false
      set command to "curl " & artworkURL & " --create-dirs -o \"./UeberPlayer.widget/cache/" & filename & "\""
      do shell script command
      log false
      return
    end if
  end tell
  log true
end run

on fileExists(f)
  tell application "System Events"
    if exists file f then
      return true
    else
      return false
    end if
  end tell
end fileExists
