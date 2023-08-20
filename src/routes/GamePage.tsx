import { useParams } from "react-router-dom";

import invariant from "tiny-invariant";
import { Device, Game } from "../models/models";
import {
  canRestart,
  canStart,
  getRandomRoundDuration,
  isCurrentlySelectedDevice,
  isThisDevice,
  selectNextDevice,
  thisDeviceIsCurrentlySelected,
} from "../helpers/game.helpers";
import { asyncTimeout } from "../utilities";
import {
  useGame,
  amIInThisGame,
  joinGame,
  restartGame,
  setCurrentTargetDevice,
  setRound,
  useDevices,
  getGameUrl,
} from "../game.data";

export function GamePage() {
  const { gameId } = useParams();
  invariant(gameId, "gameId is required");

  const { game } = useGame(gameId);
  if (game && !amIInThisGame(game)) {
    console.log("joining game");
    joinGame(gameId, false);
  }

  function onStart() {
    if (game) {
      playGame(game);
    }
  }

  function onRestart() {
    if (gameId && game) {
      restartGame(gameId, game);
    }
  }

  function onEnd() {
    //
  }

  async function playGame(game: Game) {
    playRound(game);
  }

  async function playRound(game: Game) {
    if (gameId) {
      console.log("Round", game.round, game.numberOfRounds);
      if (game.round + 1 >= game.numberOfRounds) {
        console.log("Over");
        return;
      }

      const roundDuration = getRandomRoundDuration();
      const nextDevice = selectNextDevice(game, devices);
      console.log("nextDevice", nextDevice);
      setCurrentTargetDevice(gameId, nextDevice.id);

      console.log("Run to the device!", game);
      await asyncTimeout(roundDuration);

      game.round++;
      setRound(gameId, game.round);
      playRound(game);
    }
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
            {devices.map((device) => {
              return (
                <DeviceListItem key={device.id} device={device} game={game} />
              );
            })}
          </ul>
          {game.gameover && (
            <div>
              <div>Game Over</div>
            </div>
          )}
          <div>
            My turn: {thisDeviceIsCurrentlySelected(game) ? "✅" : "❌"}
          </div>
          {game && (
            <>
              {canStart(game, devices) && (
                <button onClick={() => onStart()}>Start</button>
              )}
              {canRestart(game, devices) && (
                <button onClick={() => onRestart()}>Restart</button>
              )}
              <button onClick={() => onEnd()}>End</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

function DeviceListItem(props: { game: Game; device: Device }) {
  const { game, device } = props;
  const description = `${device.id} ${
    isThisDevice(device) ? "(This Device)" : ""
  } ${isCurrentlySelectedDevice(game, device.id) ? "(Selected)" : ""} ${
    device.isHost ? "(Host)" : ""
  }`;
  return <div>{description}</div>;
}
