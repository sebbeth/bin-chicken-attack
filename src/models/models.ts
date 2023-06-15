
export type Game = {
    id: string;
    devices: Device[];
    gameover: boolean;
    round: number;
    currentTargetDevice: string;
}

export type Device = {
    id: string;
    isHost: boolean;
}
