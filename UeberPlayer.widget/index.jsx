
import { styled, run } from "uebersicht";
import getColors from './lib/getColors.js';
const _version = '1.2.2';

/* CUSTOMIZATION (mess around here!)
You may need to refresh the widget after changing these settings
For more details about these settings: please visit https://github.com/aCluelessDanny/UeberPlayer#settings */

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
  cacheMaxDays: 15,             // -> 15 (default) | <number>

  /* Check for updates */
  checkForUpdates: true         // -> true (default) | false
}

/* ROOT STYLING */

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

/* EMOTION COMPONENTS */

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
  background: ${props => (props.bg !== undefined) ? props.bg : "#0004"};
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

const MediumPlayer = styled(BigPlayer)`
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

const Artwork = styled("img")`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.show ? 1 : 0};
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

const UpdateNotif = styled("div")`
  position: absolute;
  top: 0;
  width: 100%;
  padding: 1em;
  min-height: 30%;
  background-image: linear-gradient(to bottom, #000b, transparent);
`

const UpdateText = styled("p")`
  font-size: .7em;
  text-align: center !important;

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`

/* UEBER-SPECIFIC STUFF */

export const init = (dispatch) => {
  // Initialize and clear cache of old artwork
  run(
    `mkdir -p UeberPlayer.widget/cache &&\
    find UeberPlayer.widget/cache -mindepth 1 -type f -mtime +${options.cacheMaxDays} -delete &&\
    osascript UeberPlayer.widget/lib/init.scpt`
  );
  // Check for updates when enabled
  if (options.checkForUpdates) {
    checkForUpdate(dispatch);
    setInterval(checkForUpdate, 86400000, dispatch);
  }
};

export const command = "osascript UeberPlayer.widget/lib/getTrack.scpt";

export const initialState = {
  playing: false,                                   // If currently playing a soundtrack
  songChange: false,                                // If the song changed
  primaryColor: undefined,                          // Primary color from artwork
  secondaryColor: undefined,                        // Secondary color from artwork
  tercaryColor: undefined,                          // Tercary color from artwork
  artwork: {                                          // Artwork source URL to be used
    art1: "UeberPlayer.widget/default.png",
    art2: "UeberPlayer.widget/default.png",
    alternate: true
  },
  song: {
    track: "",                                      // Name of soundtrack
    artist: "",                                     // Name of artist
    album: "",                                      // Name of album
    localArtwork: "",                               // Locally stored url for album artwork
    onlineArtwork: "",                              // Online url for album artwork
    duration: 0,                                    // Total duration of soundtrack in seconds
    elapsed: 0                                      // Total time elapsed in seconds
  },
  updateAvailable: false                            // Flag for when an update's available
};

// Update state
export const updateState = ({ type, output, error }, previousState) => {
  switch (type) {
    case 'UB/COMMAND_RAN':
      return updateSongData(output, error, previousState);
    case 'GET_ART':
      if (options.adaptiveColors) {
        return getColors(output, previousState, options);
      } else {
        const { art1, art2, alternate } = previousState.artwork;
        return {
          ...previousState,
          songChange: false,
          primaryColor: undefined,
          secondaryColor: undefined,
          tercaryColor: undefined,
          artwork: {
            art1: alternate ? art1 : output.img.src,
            art2: !alternate ? art2 : output.img.src,
            alternate: !alternate
          }
        }
      }
    case 'DEFAULT_ART':
      const { art1, art2, alternate } = previousState.artwork;
      return {
        ...previousState,
        songChange: false,
        primaryColor: undefined,
        secondaryColor: undefined,
        tercaryColor: undefined,
        artwork: {
          art1: alternate ? art1 : "UeberPlayer.widget/default.png",
          art2: !alternate ? art2 : "UeberPlayer.widget/default.png",
          alternate: !alternate
        }
      }
    case 'UPDATE_AVAILABLE':
      return { ...previousState, updateAvailable: true }
    default:
      console.error("Invalid dispatch type?");
      return previousState;
  }
}

/* FUNCTIONS */

// Check for update
const checkForUpdate = async (dispatch) => {
  let resp = await fetch('https://raw.githubusercontent.com/aCluelessDanny/UeberPlayer/master/widget.json');
  if (!resp.ok) { throw Error("Unable to check for update!") }

  let data = await resp.json();
  if (_version !== data.version) {
    console.log(`There's an update available! -> ${data.version}`);
    dispatch({ type: "UPDATE_AVAILABLE" });
  }
}

// Update song metadata
const updateSongData = (output, error, previousState) => {
  // Check for errors
  if (error) {
    const err_output = { ...previousState, error: error };
    console.error(err_output);
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
    return {
      ...previousState,
      playing,
      songChange: true,
      song: {
        track,
        artist,
        album,
        localArtwork: `UeberPlayer.widget/cache/${artworkFilename}`,
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

// Prepare artwork
const prepareArtwork = (dispatch, song) => {
  // Use a dummy image to test images beforehand
  const img = new Image();

  // Attempts images in this order: Local -> Online -> Default
  img.onload = () => { dispatch({ type: "GET_ART", output: { img }})};
  img.onerror = () => {
    if (song.onlineArtwork !== "missing value" && img.src !== song.onlineArtwork) {
      img.src = song.onlineArtwork;
    } else {
      dispatch({ type: "DEFAULT_ART" });
    }
  }

  img.src = song.localArtwork;
}

// RENDERING //
// Artwork image
const artworkImage = (wrapperClass, { art1, art2, alternate }) => (
  <ArtworkWrapper className={wrapperClass}>
    <Artwork src={art1} show={alternate}/>
    <Artwork src={art2} show={!alternate}/>
  </ArtworkWrapper>
)

// Update notification component
const updateNotif = ( text, color = 'inherit' ) => {
  return text ? (
    <UpdateText style={{ color }}><a href="https://raw.githubusercontent.com/aCluelessDanny/UeberPlayer/master/UeberPlayer.widget.zip">An update is available!</a></UpdateText>
  ) : (
    <UpdateNotif>
      <UpdateText><a href="https://raw.githubusercontent.com/aCluelessDanny/UeberPlayer/master/UeberPlayer.widget.zip">An update is available!</a></UpdateText>
    </UpdateNotif>
  )
}

// Big player component
const big = ({ track, artist, album, elapsed, duration }, secondaryColor, tercaryColor, artwork, updateAvailable) => (
  <BigPlayer>
    {artworkImage("big", artwork)}
    {updateAvailable && updateNotif(false)}
    <Information>
      <Progress progressColor={secondaryColor} emptyColor={tercaryColor} percent={elapsed / duration * 100}/>
      <Track className="small" color={secondaryColor}>{track}</Track>
      <Artist className="small" color={tercaryColor}>{artist}</Artist>
      <Album className="small" color={tercaryColor}>{album}</Album>
    </Information>
  </BigPlayer>
);

// Medium player component
const medium = ({ track, artist, elapsed, duration }, secondaryColor, tercaryColor, artwork, updateAvailable) => (
  <MediumPlayer>
    {artworkImage("medium", artwork)}
    {updateAvailable && updateNotif(false)}
    <Information>
      <Progress progressColor={secondaryColor} emptyColor={tercaryColor} percent={elapsed / duration * 100}/>
      <Track color={secondaryColor}>{track}</Track>
      <Artist color={tercaryColor}>{artist}</Artist>
    </Information>
  </MediumPlayer>
)

// Small player component
const small = ({ track, artist, album, elapsed, duration }, secondaryColor, tercaryColor, artwork, updateAvailable) => (
  <SmallPlayer>
    {artworkImage("small", artwork)}
    <Information className="small">
      <Track color={secondaryColor}>{track}</Track>
      <Artist color={tercaryColor}>{artist}</Artist>
      <Album color={tercaryColor}>{album}</Album>
      {updateAvailable && updateNotif(true, secondaryColor)}
      <Progress progressColor={secondaryColor} emptyColor={tercaryColor} className="small" percent={elapsed / duration * 100}/>
    </Information>
  </SmallPlayer>
)

// Mini player component
const mini = ({ track, artist, elapsed, duration }, primaryColor, secondaryColor, updateAvailable) => (
  <MiniPlayer>
    <Track className="mini">{track}</Track>
    <Artist className="mini">{artist}</Artist>
    <Progress className="mini" progressColor={primaryColor} emptyColor={secondaryColor} percent={elapsed / duration * 100}/>
    {updateAvailable && updateNotif(true)}
  </MiniPlayer>
)

// Render function
export const render = ({ playing, songChange, primaryColor, secondaryColor, tercaryColor, artwork, song, updateAvailable }, dispatch) => {
  const { size, horizontalPosition, verticalPosition } = options;

  // When song changes, prepare artwork
  if (songChange) {
    prepareArtwork(dispatch, song);
  }

  // Render
  return (size === "mini") ? (
    <MiniWrapper playing={playing} horizontal={horizontalPosition} vertical={verticalPosition}>
      {mini(song, primaryColor, secondaryColor, updateAvailable)}
    </MiniWrapper>
  ) : (
    <Wrapper playing={playing} bg={primaryColor} horizontal={horizontalPosition} vertical={verticalPosition}>
      {size === "big" && big(song, secondaryColor, tercaryColor, artwork, updateAvailable)}
      {size === "medium" && medium(song, secondaryColor, tercaryColor, artwork, updateAvailable)}
      {size === "small" && small(song, secondaryColor, tercaryColor, artwork, updateAvailable)}
    </Wrapper>
  )
};
