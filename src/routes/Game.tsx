import { useParams } from "react-router-dom";
import {
  amIInThisGame,
  getGameUrl,
  isCurrentlySelectedDevice,
  isThisDevice,
  joinGame,
  useDevices,
  useGame,
} from "../game.data";
import invariant from "tiny-invariant";
import { Device } from "../models/models";

export function Game() {
  const { gameId } = useParams();
  invariant(gameId, "gameId is required");

  const { game } = useGame(gameId);
  if (game && !amIInThisGame(game)) {
    console.log("joining game");
    joinGame(gameId, false);
  }

  const { devices } = useDevices(gameId);
  console.log("devices", devices);
  return (
    <div>
      <div>Url: {getGameUrl(gameId)}</div>
      {game && devices && (
        <>
          <div>Devices:</div>
          <ul>
            {
              devices.map((device) => {
                return <DeviceListItem key={device.id} device={device} />;
              })}
          </ul>
          <div>My turn: {isCurrentlySelectedDevice(game) ? "✅" : "❌"}</div>
        </>
      )}
    </div>
  );
}

function DeviceListItem(props: { device: Device }) {
  const { device } = props;
  const description = `${device.id} ${
    isThisDevice(device) ? "(This Device)" : ""
  } ${device.isHost ? "(Host)" : ""}`;
  return <div>{description}</div>;
}
