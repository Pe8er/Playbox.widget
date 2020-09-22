
import { styled, run } from "uebersicht";
import ColorThief from "./lib/color-thief.mjs";

import getColors from './lib/getColors.js';

const Thief = new ColorThief();

// CUSTOMIZATION (mess around here!)
// For more details about these settings: please visit https://github.com/aCluelessDanny/UeberPlayer#settings

const options = {
  /* Widget size! */
  size: "big",                  // -> big (default) | medium | small | mini

  /* Widget position! */
  verticalPosition: "top",      // -> top (default) | center | bottom | "<number>" | "-<number>"
  horizontalPosition: "left",   // -> left (default) | center | right | "<number>" | "-<number>"

  /* Adaptive colors! */
  adaptiveColors: true,         // -> true (default) | false
  minContrast: 2.6,             // -> 2.6 (default) | number

  /* Dual-colored progress bar! */
  dualProgressBar: false,       // -> true | false (default)

  /* Cache setting! */
  cacheMaxDays: 15              // 15 (default) | <number>
}

// ROOT STYLING //

export const className = `
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  color: white;

  * {
    box-sizing: border-box;
    padding: 0;
    border: 0;
    margin: 0;
  }
`;

// EMOTION COMPONENTS //

const wrapperPos = ({ horizontal, vertical }) => {
  if (horizontal === "center" && vertical === "center") {
    return `
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `
  }

  let hPos, vPos;
  switch (horizontal) {
    case "left": hPos = `left: 20px;`; break;
    case "center": hPos = `left: 50%; transform: translateX(-50%);`; break;
    case "right": hPos = `right: 20px;`; break;
    default: hPos = horizontal.startsWith("-") ? `right: ${parseInt(horizontal) * -1}px;` : `left: ${horizontal}px;`; break;
  }
  switch (vertical) {
    case "top": vPos = `top: 20px;`; break;
    case "center": vPos = `top: 50%; transform: translateY(-50%);`; break;
    case "bottom": vPos = `bottom: 20px;`; break;
    default: vPos = vertical.startsWith("-") ? `bottom: ${parseInt(vertical) * -1}px;` : `top: ${vertical}px;`; break;
  }

  return `${hPos} ${vPos}`;
}

const Wrapper = styled("div")`
  position: absolute;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 16px 32px 9px #0005;
  opacity: ${props => props.playing ? 1 : 0};
  background: ${props => (props.bg !== undefined) ? props.bg : "inherit"};
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  ${wrapperPos}

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-radius: 6px;
    z-index: -1;
  }

  * {
    transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }
`;

const miniWrapperPos = ({ horizontal }) => {
  switch (horizontal) {
    case "left": return `text-align: left;`;
    case "center": return `text-align: center;`;
    case "right": return `text-align: right;`;
    default: return horizontal.startsWith("-") ? `text-align: right;` : `text-align: left;`;
  }
}

const MiniWrapper = styled(Wrapper)`
  border-radius: 0;
  overflow: visible;
  box-shadow: none;
  background: transparent;
  ${miniWrapperPos}

  &::before {
    display: none;
  }
`

const BigPlayer = styled("div")`
  display: flex;
  flex-direction: column;
  width: 240px;
`;

const MediumPlayer = styled("div")`
  display: flex;
  flex-direction: column;
  width: 180px;
`

const SmallPlayer = styled("div")`
  position: relative;
  display: flex;
  height: 80px;
  width: 340px;
`

const MiniPlayer = styled("div")`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 400px;
  line-height: 1;

  * {
    text-shadow: 0px 0px 4px #0004, 0px 2px 12px #0004;
  }

  > * + * {
    margin-top: .5em;
  }
`

const ArtworkWrapper = styled("div")`
  position: relative;
  width: 240px;
  height: 240px;
  background: url("UeberPlayer.widget/default.png");
  background-size: cover;

  &.medium {
    width: 180px;
    height: 180px;
  }

  &.small {
    width: 80px;
    height: 80px;
  }

  &::before {
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-radius: 6px 6px 0 0;
    background: #fff1;
    backdrop-filter: blur(8px) brightness(90%) contrast(80%) saturate(140%);
    z-index: -1;
  }
`

const Artwork = styled("div")`
  width: 240px;
  height: 240px;
  background: url("${props => props.localArt}"), url("${props => props.onlineArt}"), transparent;
  background-size: cover;

  &.medium {
    width: 180px;
    height: 180px;
  }

  &.small {
    width: 80px;
    height: 80px;
  }
`;

const Information = styled("div")`
  position: relative;
  padding: .5em .75em;
  line-height: 1.3;
  border-radius: 0 0 6px 6px;
  backdrop-filter: ${options.adaptiveColors ? "blur(8px)" : "blur(8px) brightness(90%) contrast(80%) saturate(140%)"};

  > p {
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.small {
    flex: 1;
    width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 0 6px 6px 0;
    line-height: 1.4;
  }

  &.small > p {
    text-align: left;
  }
`

const Progress = styled("div")`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: ${props => options.dualProgressBar && props.emptyColor ? (props.emptyColor + "80") : "transparent"};

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: ${props => props.percent}%;
    background: ${props => props.progressColor ? props.progressColor : "white"};
    transition: width .6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &.small {
    top: initial;
    bottom: 0;
  }

  &.mini {
    position: relative;
    height: 4px;
    border-radius: 2px;
    background: ${props => options.dualProgressBar && props.emptyColor ? (props.emptyColor + "60") : "#0005"};
    box-shadow: 0 3px 5px -1px #0003;
    overflow: hidden;
  }
`

const Track = styled("p")`
  font-weight: bold;
  font-size: .7em;
  color: ${props => props.color ? props.color : "inherit"};

  &.small {
    font-size: .65em;
  }

  &.mini {
    font-size: 1.2em;
  }
`

const Artist = styled("p")`
  font-size: .7em;
  color: ${props => props.color ? props.color : "inherit"};

  &.small {
    font-size: .65em;
  }

  &.mini {
    font-size: 1em;
  }
`

const Album = styled("p")`
  font-size: .65em;
  color: ${props => props.color ? props.color : "inherit"};
  opacity: .75;

  &.small {
    font-size: .55em;
  }
`

// UEBER-SPECIFIC STUFF //

export const command = "osascript UeberPlayer.widget/getTrack.scpt";

export const initialState = {
  playing: false,               // If currently playing a soundtrack
  songChange: false,            // If the song changed
  primaryColor: undefined,      // Primary color from artwork
  secondaryColor: undefined,    // Secondary color from artwork
  tercaryColor: undefined,      // Tercary color from artwork
  song: {
    track: "",                    // Name of soundtrack
    artist: "",                   // Name of artist
    album: "",                    // Name of album
    artwork: "",                  // Locally stored url for album artwork
    onlineArtwork: "",            // Online url for album artwork
    duration: 0,                  // Total duration of soundtrack in seconds
    elapsed: 0                    // Total time elapsed in seconds
  }
};

// FUNCTIONS //

// Initialize function (remove old, cached files)
export const init = () => run(`find UeberPlayer.widget/cache -mindepth 1 -type f -mtime +${options.cacheMaxDays} -delete`);

const updateSongData = (output, error, previousState) => {
  // Check for errors
  if (error) {
    const err_output = { ...previousState, error: error };
    console.error(err_output)
    return err_output;
  }

  // Extract & parse applescript output
  let [
    playing,
    app,
    track,
    artist,
    album,
    artworkURL,
    artworkFilename,
    duration,
    elapsed
  ] = output.split(" @@ ");

  playing = (playing === "true");
  duration = Math.floor(parseFloat(duration));
  elapsed = Math.floor(parseFloat(elapsed));

  // State controller
  if (!playing) {   // If player is paused
    return { ...previousState, playing };
  } else if (track !== previousState.song.track || album !== previousState.song.album) {    // Song change
    const filepath = `UeberPlayer.widget/cache/${artworkFilename}`;

    return {
      ...previousState,
      playing,
      songChange: true,
      song: {
        track,
        artist,
        album,
        localArtwork: filepath,
        onlineArtwork: artworkURL,
        duration,
        elapsed
      }
    }
  } else {  // Currently playing
    return {
      ...previousState,
      playing,
      song: {
        ...previousState.song,
        elapsed
      }
    };
  }
}

// Update state
export const updateState = ({ type, output, error }, previousState) => {
  switch (type) {
    case 'UB/COMMAND_RAN': return updateSongData(output, error, previousState);
    case 'GET_COLORS': return getColors(output, previousState, options);
    case 'DEFAULT_COLORS': return {
      ...previousState,
      songChange: false,
      primaryColor: undefined,
      secondaryColor: undefined,
      tercaryColor: undefined
    }
    default:
      console.error("Invalid dispatch type?");
      return previousState;
  }
}

// RENDERING //
// Big player component
const big = ({ track, artist, album, localArtwork, onlineArtwork, elapsed, duration }, secondaryColor, tercaryColor) => (
  <BigPlayer>
    <ArtworkWrapper>
      <Artwork localArt={localArtwork} onlineArt={onlineArtwork}/>
    </ArtworkWrapper>
    <Information>
      <Progress progressColor={secondaryColor} emptyColor={tercaryColor} percent={elapsed / duration * 100}/>
      <Track className="small" color={secondaryColor}>{track}</Track>
      <Artist className="small" color={tercaryColor}>{artist}</Artist>
      <Album className="small" color={tercaryColor}>{album}</Album>
    </Information>
  </BigPlayer>
);

// Medium player component
const medium = ({ track, artist, localArtwork, onlineArtwork, elapsed, duration }, secondaryColor, tercaryColor) => (
  <MediumPlayer>
    <ArtworkWrapper className="medium">
      <Artwork className="medium" localArt={localArtwork} onlineArt={onlineArtwork}/>
    </ArtworkWrapper>
    <Information>
      <Progress progressColor={secondaryColor} emptyColor={tercaryColor} percent={elapsed / duration * 100}/>
      <Track color={secondaryColor}>{track}</Track>
      <Artist color={tercaryColor}>{artist}</Artist>
    </Information>
  </MediumPlayer>
)

// Small player component
const small = ({ track, artist, album, localArtwork, onlineArtwork, elapsed, duration }, secondaryColor, tercaryColor) => (
  <SmallPlayer>
    <ArtworkWrapper className="small">
      <Artwork className="small" localArt={localArtwork} onlineArt={onlineArtwork}/>
    </ArtworkWrapper>
    <Information className="small">
      <Track color={secondaryColor}>{track}</Track>
      <Artist color={tercaryColor}>{artist}</Artist>
      <Album color={tercaryColor}>{album}</Album>
      <Progress progressColor={secondaryColor} emptyColor={tercaryColor} className="small" percent={elapsed / duration * 100}/>
    </Information>
  </SmallPlayer>
)

// Mini player component
const mini = ({ track, artist, elapsed, duration }, primaryColor, secondaryColor) => (
  <MiniPlayer>
    <Track className="mini">{track}</Track>
    <Artist className="mini">{artist}</Artist>
    <Progress className="mini" progressColor={primaryColor} emptyColor={secondaryColor} percent={elapsed / duration * 100}/>
  </MiniPlayer>
)

// Render function
export const render = ({ playing, songChange, primaryColor, secondaryColor, tercaryColor, song }, dispatch) => {
  const { size, horizontalPosition, verticalPosition, adaptiveColors } = options;

  // When song changes, begin extracting artwork colors and pass them to state
  if (adaptiveColors && songChange) {
    const img = new Image();
    img.onload = () => dispatch({ type: "GET_COLORS", output: { dominantColor: Thief.getColor(img), palette: Thief.getPalette(img) }});
    img.onerror = () => dispatch({ type: "DEFAULT_COLORS" });   // Fallback if unable to load image for colors
    img.src = song.localArtwork;
  }

  return (size === "mini") ? (
    <MiniWrapper playing={playing} horizontal={horizontalPosition} vertical={verticalPosition}>
      {mini(song, primaryColor, secondaryColor)}
    </MiniWrapper>
  ) : (
    <Wrapper playing={playing} bg={primaryColor} horizontal={horizontalPosition} vertical={verticalPosition}>
      {size === "big" && big(song, secondaryColor, tercaryColor)}
      {size === "medium" && medium(song, secondaryColor, tercaryColor)}
      {size === "small" && small(song, secondaryColor, tercaryColor)}
    </Wrapper>
  )
};
