
import { styled, run } from "uebersicht"

export const command = "osascript ./UeberPlayer.widget/getTrack.applescript | echo";

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
    -webkit-backdrop-filter: blur(8px) brightness(95%) contrast(80%) saturate(140%);
    backdrop-filter: blur(8px) brightness(95%) contrast(80%) saturate(140%);
    z-index: -1;
  }
`;

const BigPlayer = styled("div")`
  display: flex;
  flex-direction: column;
  width: 240px;
`;

const Artwork = styled("img")`
  width: 100%;
  height: auto;
`;

const Information = styled("div")`
  position: relative;
  padding: .5em .75em;
  line-height: 1.3;
  border-radius: 0 0 6px 6px;
  -webkit-backdrop-filter: blur(8px) brightness(95%) contrast(80%) saturate(140%);
  backdrop-filter: blur(8px) brightness(95%) contrast(80%) saturate(140%);

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
    width: ${(props) => props.percent}%;
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
`

export const updateState = (event, previousState) => {
  // Check for error
  if (event.error) {
    console.log("Something happened!? " + event.error);
    return { ...previousState, error: event.error };
  }

  // Extract applescript output & parse state
  // console.log(event.output.split("\n").slice(1, -1));
  const [
    status,
    track,
    artist,
    album,
    artwork,
    duration,
    elapsed
  ] = event.output.split("\n").slice(1, -1);

  const state = {
    status,
    data: {
      track,
      artist,
      album,
      artwork,
      duration,
      elapsed
    }
  };

  // Return state
  return state;
};

export const render = ({ status, data }) => (
  <Wrapper>
    <BigPlayer>
      <Artwork src={data.artwork}/>
      <Information>
        <Progress percent={data.elapsed / data.duration * 100}/>
        <Track>{data.track}</Track>
        <Artist>{data.artist}</Artist>
        <Album>{data.album}</Album>
      </Information>
    </BigPlayer>
  </Wrapper>
);
