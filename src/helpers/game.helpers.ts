import { Device, Game } from "../models/models";
import { asyncTimeout } from "../utilities";

export function getRandomRoundDuration() {
  const min = 1000;
  const max = 2000;
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// select a random device from the list of devices that is NOT the currently selected device
export function selectNextDevice(game: Game, devices: Device[]) {
  const currentDeviceId = game.currentTargetDevice;
  const availableDevices = devices.filter(
    (device) => device.id !== currentDeviceId
  );
  const randomIndex = Math.floor(Math.random() * availableDevices.length);
  return availableDevices[randomIndex];
}

export function canStart(game: Game, devices: Device[]) {
  if (devices.length > 1 && game.round === 0 && !game.gameover) {
    return true;
  }
  return false;
}

export function canRestart(game: Game, devices: Device[]) {
  if (devices.length > 1 && game.round === game.numberOfRounds - 1) {
    return true;
  }
  return false;
}

export function isThisDevice(device: Device) {
  if (device.id === getCurrentDeviceId()) {
    return true;
  }
  return false;
}

export function isCurrentlySelectedDevice(game: Game, deviceId: number) {
  return (
    game.currentTargetDevice === deviceId &&
    game.round + 1 < game.numberOfRounds
  );
}

export function thisDeviceIsCurrentlySelected(game: Game) {
  return isCurrentlySelectedDevice(game, getCurrentDeviceId());
}

export function getCurrentDeviceId() {
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
