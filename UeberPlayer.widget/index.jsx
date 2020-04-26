
import { styled, run } from "uebersicht";
import ColorTheif from "./lib/color-thief.mjs"

const Theif = new ColorTheif();

// CUSTOMIZATION

const options = {
  // Widget size!  --  big | medium | small | mini
  size: "small",
}


// EMOTION COMPONENTS

const Wrapper = styled("div")`
  position: absolute;
  top: 20px;
  left: 20px;
  border-radius: ${props => props.mini ? 0 : "6px"};
  overflow: ${props => props.mini ? "visible" : "hidden"};
  box-shadow: ${props => props.mini ? "0" : "0 16px 32px 9px #0005"};
  opacity: ${props => props.playing ? 1 : 0};
  background: ${props => (props.bg !== undefined) ? props.bg : "inherit"};
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);

  &::before {
    content: "";
    display: ${props => props.mini ? "none" : "initial"};
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-radius: 6px;
    backdrop-filter: blur(8px) brightness(90%) contrast(80%) saturate(140%);
    z-index: -1;
  }

  * {
    transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }
`;

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
    text-shadow: 0 2px 12px #0008;
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
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #fff7;
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
  /* backdrop-filter: blur(8px) brightness(90%) contrast(80%) saturate(140%); */

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
  background: transparent;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: ${props => props.percent}%;
    background: ${props => props.color ? props.color : "white"};
  }

  &.small {
    top: initial;
    bottom: 0;
  }

  &.mini {
    position: relative;
    height: 4px;
    border-radius: 2px;
    background: #0002;
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

export const className = `
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  color: white;

  * {
    box-sizing: border-box;
    padding: 0;
    border: 0;
    margin: 0;
  }
`;

export const command = "osascript UeberPlayer.widget/getTrack.scpt";

export const initialState = {
  playing: false,           // If currently playing a soundtrack
  songChange: false,        // If the song changed
  primaryColor: undefined,
  secondaryColor: undefined,
  tercaryColor: undefined,
  song: {
    track: "",              // Name of soundtrack
    artist: "",             // Name of artist
    album: "",              // Name of album
    artwork: "",            // Locally stored url for album artwork
    onlineArtwork: "",      // Online url for album artwork
    duration: 0,            // Total duration of soundtrack in seconds
    elapsed: 0              // Total time elapsed in seconds
  }
};

// FUNCTIONS //

// Initialize function (remove old, cached files)
export const init = () => run(`find UeberPlayer.widget/cache -mindepth 1 -type f -mtime +15 -delete`);

const updateSongData = (output, error, previousState) => {
  // Check for errors
  if (error) {
    console.log("Something happened!? " + error);
    return { ...previousState, error: error };
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

  // console.log(playing, app, track, artist, album, artworkURL, artworkFilename, duration, elapsed);

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

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

const luminance = (r, g, b) => {
  const a = [r, g, b].map((x) => {
    x /= 255;
    return (x <= .03928) ? (x / 12.92) : (Math.pow( (x + 0.055) / 1.055, 2.4 ));
  });
  return a[0] * .2126 + a[1] * .7152 + a[2] * .0722;
}

const contrast = (lum1, lum2) => {
  const lightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (lightest + .05) / (darkest + .05);
}

const updateColors = (theif, previousState) => {
  const primaryColor = theif.dominantColor;
  let secondaryColor, tercaryColor;

  let secondaryContrast = 0, tercaryContrast = 0;
  const primaryColorLum = luminance(primaryColor[0], primaryColor[1], primaryColor[2]);
  for (const swatch of theif.palette) {
    const swatchLum = luminance(swatch[0], swatch[1], swatch[2]);
    const contrastValue = contrast(primaryColorLum, swatchLum);

    if (contrastValue >= 2) {
      if (secondaryContrast < 2) {
        secondaryColor = swatch;
        secondaryContrast = contrastValue;
      } else {
        tercaryColor = swatch;
        tercaryContrast = contrastValue;
        break;
      }
    } else if (contrastValue > secondaryContrast) {
      tercaryColor = secondaryColor;
      tercaryContrast = secondaryContrast;
      secondaryColor = swatch;
      secondaryContrast = contrastValue;
    } else if (contrastValue > tercaryContrast) {
      tercaryColor = swatch;
      tercaryContrast = contrastValue;
    }
  }

  return {
    ...previousState,
    songChange: false,
    primaryColor: rgbToHex(primaryColor[0], primaryColor[1], primaryColor[2]),
    secondaryColor: rgbToHex(secondaryColor[0], secondaryColor[1], secondaryColor[2]),
    tercaryColor: rgbToHex(tercaryColor[0], tercaryColor[1], tercaryColor[2])
  };
}

// Update state
export const updateState = ({ type, output, error }, previousState) => {
  switch (type) {
    case 'UB/COMMAND_RAN': return updateSongData(output, error, previousState);
    case 'UPDATE_COLORS': return updateColors(output, previousState);
    case 'DEFAULT_COLORS': return {
      ...previousState,
      songChange: false,
      primaryColor: undefined,
      secondaryColor: undefined,
      tercaryColor: undefined
    }
    default: {
      console.error("Invalid dispatch type?");
      return previousState;
    }
  }
}

// Big player component
const big = ({ track, artist, album, localArtwork, onlineArtwork, elapsed, duration }, secondaryColor, tercaryColor) => (
  <BigPlayer>
    <ArtworkWrapper>
      <Artwork localArt={localArtwork} onlineArt={onlineArtwork}/>
    </ArtworkWrapper>
    <Information>
      <Progress percent={elapsed / duration * 100} color={secondaryColor}/>
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
      <Progress percent={elapsed / duration * 100} color={secondaryColor}/>
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
      <Progress className="small" percent={elapsed / duration * 100} color={secondaryColor}/>
    </Information>
  </SmallPlayer>
)

const mini = ({ track, artist, elapsed, duration }) => (
  <MiniPlayer>
    <Track className="mini" color={secondaryColor}>{track}</Track>
    <Artist className="mini" color={tercaryColor}>{artist}</Artist>
    <Progress className="mini" percent={elapsed / duration * 100} color={secondaryColor}/>
  </MiniPlayer>
)

// Render function
export const render = ({ playing, songChange, primaryColor, secondaryColor, tercaryColor, song }, dispatch) => {
  const { size } = options;

  if (songChange) {
    const img = new Image();
    img.onload = () => dispatch({ type: "UPDATE_COLORS", output: { dominantColor: Theif.getColor(img), palette: Theif.getPalette(img) }});
    img.onerror = () => dispatch({ type: "DEFAULT_COLORS" });
    img.src = song.localArtwork;
  }

  return (
    <Wrapper playing={playing} mini={size === "mini"} bg={primaryColor}>
      {size === "big" && big(song, secondaryColor, tercaryColor)}
      {size === "medium" && medium(song, secondaryColor, tercaryColor)}
      {size === "small" && small(song, secondaryColor, tercaryColor)}
      {size === "mini" && mini(song, secondaryColor, tercaryColor)}
    </Wrapper>
  )
};
