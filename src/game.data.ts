import { set, ref, push, Database } from "firebase/database";
import { getDb } from "./firebase";
import { Device, Game } from "./models/models";
import invariant from "tiny-invariant";
import { useList, useObject } from "react-firebase-hooks/database";
import { getCurrentDeviceId } from "./helpers/game.helpers";

export function createNewGame(): string {
  const newGame: Game = {
    devices: {
      aaa: {
        id: 234234,
        isHost: false,
      },
      bbb: {
        id: 346346,
        isHost: false,
      },
      ccc: {
        id: 3463246,
        isHost: false,
      },
    },
    gameover: false,
    numberOfRounds: 4,
    round: 0,
  };

  const db = getDb();
  // Add a row to the games list
  const newGameRef = getNewGameRef(db);

  // update game with new details
  set(newGameRef, newGame);
  invariant(newGameRef.key, `newGameRef.key is null`);
  // join the game as host
  joinGame(newGameRef.key, true);
  return newGameRef.key;
}

export function restartGame(gameId: string, game: Game) {
  const db = getDb();
  game.gameover = false;
  game.round = 0;
  game.currentTargetDevice = -1;
  set(ref(db, `games/${gameId}`), game);
}

export function getGameRef(gameId: string) {
  const db = getDb();
  const gameRef = ref(db, `games/${gameId}`);
  return gameRef;
}

export function getGameUrl(gameId: string) {
  return `${window.location.origin}/game/${gameId}`;
}

export function setCurrentTargetDevice(gameId: string, deviceId: number) {
  const db = getDb();
  set(ref(db, `games/${gameId}/currentTargetDevice`), deviceId);
}

export function setRound(gameId: string, round: number) {
  const db = getDb();
  set(ref(db, `games/${gameId}/round`), round);
}

export function setGameOver(gameId: string) {
  const db = getDb();
  set(ref(db, `games/${gameId}/gameover`), true);
}

export function useGame(gameId: string) {
  const [object, loading, error] = useObject(getGameRef(gameId));
  return { game: object ? (object.val() as Game) : undefined, loading, error };
}

export function useDevices(gameId: string) {
  const db = getDb();
  const devicesRef = ref(db, `games/${gameId}/devices`);
  const [items, loading, error] = useList(devicesRef);
  const devices = items ? items.map((item) => item.val() as Device) : [];
  return { devices, loading, error };
}

export function joinGame(gameId: string, asHost: boolean) {
  const db = getDb();
  const deviceId = getCurrentDeviceId();
  const newDevice: Device = {
    id: deviceId,
    isHost: asHost,
  };
  set(ref(db, `games/${gameId}/devices/${deviceId}`), newDevice);
}

export function amIInThisGame(game: Game) {
  const deviceId = getCurrentDeviceId();
  // If game.devices has a key that matches my deviceId, then I'm in this game
  return !game.devices || game.devices[deviceId] !== undefined;
}

function getNewGameRef(db: Database) {
  return push(ref(db, "games"));
}
