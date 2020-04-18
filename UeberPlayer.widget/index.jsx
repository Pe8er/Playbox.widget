
import { styled, run } from "uebersicht"

// CUSTOMIZATION

const options = {
  // Widget size!  --  big | medium | small | mini
  size: "big",
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
  transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1);

  &::before {
    content: "";
    display: ${props => props.mini ? "none" : "initial"};
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-radius: 6px;
    -webkit-backdrop-filter: blur(8px) brightness(90%) contrast(80%) saturate(140%);
    backdrop-filter: blur(8px) brightness(90%) contrast(80%) saturate(140%);
    z-index: -1;
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
  -webkit-backdrop-filter: blur(8px) brightness(90%) contrast(80%) saturate(140%);
  backdrop-filter: blur(8px) brightness(90%) contrast(80%) saturate(140%);

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
    background: white;
    transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
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

  &.small {
    font-size: .65em;
  }

  &.mini {
    font-size: 1.2em;
  }
`

const Artist = styled("p")`
  font-size: .7em;

  &.small {
    font-size: .65em;
  }

  &.mini {
    font-size: 1em;
  }
`

const Album = styled("p")`
  font-size: .65em;
  color: #e6e6e6;
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

export const command = "osascript UeberPlayer.widget/getTrack.scpt | echo";

export const initialState = {
  playing: false,           // If currently playing a soundtrack
  data: {
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

// Get album artwork and cache it in memory
const getArtwork = (app, url, album, artist, ext) => {
  // Parse a safe image name for caching
  const filename = `${album}-${artist}.${ext}`.split(/[" ]/).join('');

  // Run an applescript to check if artwork is already cached, and if not, cache it for later use
  run(`osascript UeberPlayer.widget/getArtwork.scpt ${app} "${filename}" ${url} ${ext} | echo`);

  return `UeberPlayer.widget/cache/${filename}`;
}

// Update state
export const updateState = ({ output, error }, previousState) => {
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
    artExtension,
    duration,
    elapsed
  ] = output.split("\n").slice(1, -1);
  playing = playing === "true";

  // State controller
  if (!playing) {   // If player is paused
    return { ...previousState, playing };
  } else if (track !== previousState.data.track || album !== previousState.data.album) {    // Song change
    return {
      playing,
      data: {
        track,
        artist,
        album,
        artwork: getArtwork(app, artworkURL, album, artist, artExtension),
        onlineArtwork: artworkURL,
        duration,
        elapsed
      }
    }
  } else {  // Currently playing
    return {
      playing,
      data: {
        ...previousState.data,
        artwork: previousState.data.artwork + (/.+#1$/.test(previousState.data.artwork) ? "" : "#1"),
        elapsed
      }
    };
  }
}

// Big player component
const big = ({ track, artist, album, artwork, onlineArtwork, elapsed, duration }) => (
  <BigPlayer>
    <ArtworkWrapper>
      <Artwork localArt={artwork} onlineArt={onlineArtwork}/>
    </ArtworkWrapper>
    <Information>
      <Progress percent={elapsed / duration * 100}/>
      <Track className="small">{track}</Track>
      <Artist className="small">{artist}</Artist>
      <Album className="small">{album}</Album>
    </Information>
  </BigPlayer>
);

// Medium player component
const medium = ({ track, artist, artwork, onlineArtwork, elapsed, duration }) => (
  <MediumPlayer>
    <ArtworkWrapper className="medium">
      <Artwork className="medium" localArt={artwork} onlineArt={onlineArtwork}/>
    </ArtworkWrapper>
    <Information>
      <Progress percent={elapsed / duration * 100}/>
      <Track>{track}</Track>
      <Artist>{artist}</Artist>
    </Information>
  </MediumPlayer>
)

// Small player component
const small = ({ track, artist, album, artwork, onlineArtwork, elapsed, duration }) => (
  <SmallPlayer>
    <ArtworkWrapper className="small">
      <Artwork className="small" localArt={artwork} onlineArt={onlineArtwork}/>
    </ArtworkWrapper>
    <Information className="small">
      <Track>{track}</Track>
      <Artist>{artist}</Artist>
      <Album>{album}</Album>
      <Progress className="small" percent={elapsed / duration * 100}/>
    </Information>
  </SmallPlayer>
)

const mini = ({ track, artist, elapsed, duration }) => (
  <MiniPlayer>
    <Track className="mini">{track}</Track>
    <Artist className="mini">{artist}</Artist>
    <Progress className="mini" percent={elapsed / duration * 100}/>
  </MiniPlayer>
)

// Render function
export const render = ({ playing, data }) => {
  const { size } = options;

  return (
    <Wrapper playing={playing} mini={size === "mini"}>
      {size === "big" && big(data)}
      {size === "medium" && medium(data)}
      {size === "small" && small(data)}
      {size === "mini" && mini(data)}
    </Wrapper>
  )
};
