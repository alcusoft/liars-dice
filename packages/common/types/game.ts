export type Die = {
  id: string;
  value: 1 | 2 | 3 | 4 | 5 | 6;
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

export type Call = "CHALLENGE_BID" | "SPOT_ON";

export type GameId = string;

export type GameConfig = {
  allowRerolling: boolean;
  allowSpotOnCalls: boolean;
  showNumDice: boolean;
  turnTimeLimit: number | null;
  hideLogsDuringRound: boolean;
  countOnesAsWild: boolean;
};

export type GameStatus = "AWAITING_BID" | "ROUND_OVER" | "GAME_OVER";

export type LobbyState = {
  gameId: GameId;
  hostPlayerId: Player["id"];
  players: Player[];
  gameConfig: GameConfig;
};

export type GameState = {
  gameId: GameId;
  gameConfig: GameConfig;
  gameStatus: GameStatus;
  hostPlayerId: Player["id"];
  activePlayerId: Player["id"];
  previousBids: Bid[];
  playerMap: Record<Player["id"], Player>;
  biddingQueue: Player["id"][];
};

export const GameConfigPresetMap = {
  classic: {
    allowRerolling: false,
    allowSpotOnCalls: true,
    showNumDice: true,
    turnTimeLimit: null,
    hideLogsDuringRound: true,
    countOnesAsWild: false,
  },
  advanced: {
    allowRerolling: true,
    allowSpotOnCalls: true,
    showNumDice: true,
    turnTimeLimit: null,
    hideLogsDuringRound: true,
    countOnesAsWild: false,
  },
} as const satisfies Record<string, GameConfig>;
