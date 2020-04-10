
import { styled, run } from "uebersicht"

// EMOTION COMPONENTS

const Wrapper = styled("div")`
  position: absolute;
  top: 20px;
  left: 20px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 16px 32px 9px #0005;

  &::before {
    content: "";
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

const ArtworkWrapper = styled("div")`
  position: relative;
  width: 240px;
  height: 240px;
  background: url("UeberPlayer.widget/default.png");
  background-size: cover;

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
`

const Track = styled("p")`
  font-weight: bold;
  font-size: .7em;
`

const Artist = styled("p")`
  font-size: .7em;
`

const Album = styled("p")`
  font-size: .65em;
  color: #e6e6e6;
  opacity: .75;
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
  playing: false,
  data: {
    track: "",
    artist: "",
    album: "",
    artwork: "",
    onlineArtwork: "",
    duration: 0,
    elapsed: 0
  }
};

// FUNCTIONS //

const getArtwork = (url, album, artist) => {
  const filename = `${album}-${artist}.jpg`.split(' ').join('');

  run(`osascript UeberPlayer.widget/getArtwork.scpt ${url} "${filename}" | echo`)
  .then((output) => output);

  return `UeberPlayer.widget/cache/${filename}`;
}

export const updateState = ({ output, error }, previousState) => {
  // Check for errors
  if (error) {
    console.log("Something happened!? " + error);
    return { ...previousState, error: error };
  }

  // Extract & parse applescript output
  let [
    playing,
    track,
    artist,
    album,
    artworkURL,
    duration,
    elapsed
  ] = output.split("\n").slice(1, -1);
  playing = playing === "true";

  if (!playing) {
    return { ...previousState, playing };
  } else if (track !== previousState.data.track || album !== previousState.data.album) {
    return {
      playing,
      data: {
        track,
        artist,
        album,
        artwork: getArtwork(artworkURL, album, artist),
        onlineArtwork: artworkURL,
        duration,
        elapsed
      }
    }
  } else {
    return { ...previousState, data: { ...previousState.data, elapsed }};
  }
}

export const render = ({ playing, data }) => {
  return (
    <Wrapper>
      <BigPlayer>
        <ArtworkWrapper>
          <Artwork localArt={data.artwork} onlineArt={data.onlineArtwork}/>
        </ArtworkWrapper>
        <Information>
          <Progress percent={data.elapsed / data.duration * 100}/>
          <Track>{data.track}</Track>
          <Artist>{data.artist}</Artist>
          <Album>{data.album}</Album>
        </Information>
      </BigPlayer>
    </Wrapper>
  )
};
