
export type Game = {
    // id: string;
    devices?: { [key: string]: Device };
    gameover: boolean;
    round: number;
    currentTargetDevice?: number;
}

export type Device = {
    id: number;
    isHost: boolean;
}
