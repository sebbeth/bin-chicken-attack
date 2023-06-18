import { set, ref, push, Database } from "firebase/database";
import { getDb } from "./firebase";
import { Device, Game } from "./models/models";
import invariant from "tiny-invariant";
import { useList, useObject } from "react-firebase-hooks/database";

export function createNewGame(): string {
  const newGame: Game = {
    gameover: false,
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

export function getGameRef(gameId: string) {
  const db = getDb();
  const gameRef = ref(db, `games/${gameId}`);
  return gameRef;
}

export function getGameUrl(gameId: string) {
  return `${window.location.origin}/game/${gameId}`;
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

export function isThisDevice(device: Device) {
  if (device.id === getCurrentDeviceId()) {
    return true;
  }
  return false;
}

export function isCurrentlySelectedDevice(game: Game) {
    const deviceId = getCurrentDeviceId();
    return game.currentTargetDevice === deviceId;
}

function getNewGameRef(db: Database) {
  return push(ref(db, "games"));
}

function getCurrentDeviceId() {
  const deviceId = sessionStorage.getItem("deviceId");
  if (deviceId) {
    return parseInt(deviceId);
  } else {
    return generateCurrentDeviceId();
  }
}

function generateCurrentDeviceId() {
  const deviceId = getNewDeviceId();
  sessionStorage.setItem("deviceId", deviceId.toString());
  return deviceId;
}

function getNewDeviceId() {
  return self.crypto.getRandomValues(new Uint32Array(1))[0];
}
