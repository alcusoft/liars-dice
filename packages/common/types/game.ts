export type Die = {
  id: string;
  value: 1 | 2 | 3 | 4 | 5 | 6;
  isVisible: boolean;
};

export type Player = {
  id: string;
  name: string;
  emoji: string;
  dice: Die[];
};

export type Bid = {
  playerId: Player["id"];
  quantity: number;
  value: Die["value"];
};

export type Call = {
  type: "CHALLENGE_BID" | "SPOT_ON";
  playerId: Player["id"];
  isCorrect: boolean | undefined;
  effect: {
    playerId: Player["id"];
    numDiceDelta: 0 | 1 | -1;
  };
};

export type GameId = string;

export type GameConfig = {
  allowRerolling: boolean;
  allowSpotOnCalls: boolean;
  showNumDice: boolean;
  turnTimeLimit: number | undefined;
  hideLogsDuringRound: boolean;
  countOnesAsWild: boolean;
  numDicePerPlayer: number;
};

export type GameStatus =
  | "IN_LOBBY"
  | "AWAITING_BID"
  | "ROUND_OVER"
  | "GAME_OVER";

export type GameState = {
  gameConfig: GameConfig;
  gameStatus: GameStatus;
  hostPlayerId: Player["id"];
  activePlayerId: Player["id"];
  previousBids: Bid[];
  playerMap: Record<Player["id"], Player>;
  biddingQueue: Player["id"][];
  timerStartTime: number | undefined;
  activeCall: Call | undefined;
};

export const GameConfigPresetMap = {
  classic: {
    allowRerolling: false,
    allowSpotOnCalls: true,
    showNumDice: true,
    turnTimeLimit: undefined,
    hideLogsDuringRound: true,
    countOnesAsWild: false,
    numDicePerPlayer: 5,
  },
  advanced: {
    allowRerolling: true,
    allowSpotOnCalls: true,
    showNumDice: true,
    turnTimeLimit: undefined,
    hideLogsDuringRound: true,
    countOnesAsWild: false,
    numDicePerPlayer: 5,
  },
} as const satisfies Record<string, GameConfig>;
