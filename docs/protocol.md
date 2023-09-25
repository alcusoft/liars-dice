# Example protocol usage

## State `[0]`

### Request

```ts
trpc.v1.game.create.mutate({
  playerName: "alcus",
});
```

### Response

```ts
{
    token: "<PLAYER_A_TOKEN>",
    gameId: "123",
}
```

### Game state

```ts
{
    gameConfig: {
        allowRerolling: true,
        allowSpotOnCalls: true,
        showNumDice: true,
        turnTimeLimit: undefined,
        hideLogsDuringRound: false,
        countOnesAsWild: false,
        numDicePerPlayer: 2,
    },
    gameStatus: "IN_LOBBY",
    hostPlayerId: "a",
    activePlayerId: "a",
    previousBids: [],
    playerMap: {
        a: {
            id: "a",
            name: "alcus",
            emoji: "apple",
            dice: [],
        },
    },
    biddingQueue: ["a"],
    timerStartTime: undefined,
    activeCall: undefined,
}
```

### Notes

- A default game config is set
- The game status is set to `IN_LOBBY`
- A new player is created with the specified name
- The new player is made the host
- The new player is moved to the start of the bidding queue
- The new player is made the active player because they are at the start of the
  bidding queue

## State `[1]`

### Request

```ts
trpc.v1.game.join.mutate({
  gameId: "123",
  playerName: "ddod",
});
```

### Response

```ts
{
    token: "<PLAYER_B_TOKEN>",
}
```

### Game state

```ts
{
    gameConfig: {
        allowRerolling: true,
        allowSpotOnCalls: true,
        showNumDice: true,
        turnTimeLimit: undefined,
        hideLogsDuringRound: false,
        countOnesAsWild: false,
        numDicePerPlayer: 2,
    },
    gameStatus: "IN_LOBBY",
    hostPlayerId: "a",
    activePlayerId: "a",
    previousBids: [],
    playerMap: {
        a: {
            id: "a",
            name: "alcus",
            emoji: "apple",
            dice: [],
        },
        b: {
            id: "b",
            name: "ddod",
            emoji: "banana",
            dice: [],
        },
    },
    biddingQueue: ["a", "b"],
    timerStartTime: undefined,
    activeCall: undefined,
}
```

### Notes

- A new player is created with the specified name
- The new player is added to the end of the bidding queue

## State `[2]`

### Request

```ts
trpc.v1.game.setPlayerOrder.mutate(["b", "a"]);
```

### Response

```ts
void
```

### Game state

```ts
{
    gameConfig: {
        allowRerolling: true,
        allowSpotOnCalls: true,
        showNumDice: true,
        turnTimeLimit: undefined,
        hideLogsDuringRound: false,
        countOnesAsWild: false,
        numDicePerPlayer: 2,
    },
    gameStatus: "IN_LOBBY",
    hostPlayerId: "a",
    activePlayerId: "b",
    previousBids: [],
    playerMap: {
        a: {
            id: "a",
            name: "alcus",
            emoji: "apple",
            dice: [],
        },
        b: {
            id: "b",
            name: "ddod",
            emoji: "banana",
            dice: [],
        },
    },
    biddingQueue: ["b", "a"],
    timerStartTime: undefined,
    activeCall: undefined,
}
```

### Notes

- Only the host player has permission to execute this procedure
- Not all player IDs need to be specified in the mutation payload
  - This avoids a potential race condition where a new player joins while the
    mutation is in flight
- The bidding queue is updated to match the mutation payload
- Any player IDs not specified by the mutation payload are kept in same order
  but moved to the end of the bidding queue
- The active player is set to the first player in the new bidding queue

## State `[3]`

### Request

```ts
trpc.v1.player.update.mutate({
  emoji: "cherries",
});
```

### Response

```ts
void
```

### Game state

```ts
{
    gameConfig: {
        allowRerolling: true,
        allowSpotOnCalls: true,
        showNumDice: true,
        turnTimeLimit: undefined,
        hideLogsDuringRound: false,
        countOnesAsWild: false,
        numDicePerPlayer: 2,
    },
    gameStatus: "IN_LOBBY",
    hostPlayerId: "a",
    activePlayerId: "b",
    previousBids: [],
    playerMap: {
        a: {
            id: "a",
            name: "alcus",
            emoji: "apple",
            dice: [],
        },
        b: {
            id: "b",
            name: "ddod",
            emoji: "cherries",
            dice: [],
        },
    },
    biddingQueue: ["b", "a"],
    timerStartTime: undefined,
    activeCall: undefined,
}
```

### Notes

- Requesters only have permission to update their own player information
- Only a player's name and emoji can be changed
- The mutation payload does not need to include both a name and an emoji

## State `[4]`

### Request

```ts
trpc.v1.game.updateConfig.mutate({
  showNumDice: false,
  hideLogsDuringRound: true,
});
```

### Response

```ts
void
```

### Game state

```ts
{
    gameConfig: {
        allowRerolling: true,
        allowSpotOnCalls: true,
        showNumDice: false,
        turnTimeLimit: undefined,
        hideLogsDuringRound: true,
        countOnesAsWild: false,
        numDicePerPlayer: 2,
    },
    gameStatus: "IN_LOBBY",
    hostPlayerId: "a",
    activePlayerId: "b",
    previousBids: [],
    playerMap: {
        a: {
            id: "a",
            name: "alcus",
            emoji: "apple",
            dice: [],
        },
        b: {
            id: "b",
            name: "ddod",
            emoji: "cherries",
            dice: [],
        },
    },
    biddingQueue: ["b", "a"],
    timerStartTime: undefined,
    activeCall: undefined,
}
```

### Notes

- Not all game config options need to be specified in the mutation payload
- Only the game config options that are specified will be changed

## State `[5]`

### Request

```ts
trpc.v1.game.startRound.mutate();
```

### Response

```ts
void
```

### Game state

```ts
{
    gameConfig: {
        allowRerolling: true,
        allowSpotOnCalls: true,
        showNumDice: false,
        turnTimeLimit: undefined,
        hideLogsDuringRound: true,
        countOnesAsWild: false,
        numDicePerPlayer: 2,
    },
    gameStatus: "AWAITING_BID",
    hostPlayerId: "a",
    activePlayerId: "b",
    previousBids: [],
    playerMap: {
        a: {
            id: "a",
            name: "alcus",
            emoji: "apple",
            dice: [
                { id: "1", value: 2, isVisible: false },
                { id: "2", value: 5, isVisible: false },
            ],
        },
        b: {
            id: "b",
            name: "ddod",
            emoji: "cherries",
            dice: [
                { id: "3", value: 6, isVisible: false },
                { id: "4", value: 6, isVisible: false },
            ],
        },
    },
    biddingQueue: ["b", "a"],
    timerStartTime: undefined,
    activeCall: undefined,
}
```

### Notes

- Only the host player has permission to execute this procedure
- The game status is switched to `AWAITING_BID`
- If the game config includes a turn time limit, the timer start time is set
- Each player's dice are rolled

## State `[6]`

### Request

```ts
trpc.v1.bid.create.mutate({
  quantity: 1,
  value: 6,
});
```

### Response

```ts
void
```

### Game state

```ts
{
   gameConfig: {
        allowRerolling: true,
        allowSpotOnCalls: true,
        showNumDice: false,
        turnTimeLimit: undefined,
        hideLogsDuringRound: true,
        countOnesAsWild: false,
        numDicePerPlayer: 2,
    },
    gameStatus: "AWAITING_BID",
    hostPlayerId: "a",
    activePlayerId: "a",
    previousBids: [
        { playerId: "b", quantity: 1, value: 6 },
    ],
    playerMap: {
        a: {
            id: "a",
            name: "alcus",
            emoji: "apple",
            dice: [
                { id: "1", value: 2, isVisible: false },
                { id: "2", value: 5, isVisible: false },
            ],
        },
        b: {
            id: "b",
            name: "ddod",
            emoji: "cherries",
            dice: [
                { id: "3", value: 6, isVisible: false },
                { id: "4", value: 6, isVisible: false },
            ],
        },
    },
    biddingQueue: ["a", "b"],
    timerStartTime: undefined,
    activeCall: undefined,
}
```

### Notes

- Only the active player has permission to execute this procedure
- Both a quantity of dice and a face value must be specified
- The bidding queue is "rotated"
- The active player is set to the first player in the new bidding queue
- The new bid is added to the log of previous bids

## State `[7]`

### Request

```ts
trpc.v1.bid.create.mutate({
  quantity: 2,
  value: 6,
});
```

### Response

```ts
void
```

### Game state

```ts
{
   gameConfig: {
        allowRerolling: true,
        allowSpotOnCalls: true,
        showNumDice: false,
        turnTimeLimit: undefined,
        hideLogsDuringRound: true,
        countOnesAsWild: false,
        numDicePerPlayer: 2,
    },
    gameStatus: "AWAITING_BID",
    hostPlayerId: "a",
    activePlayerId: "b",
    previousBids: [
        { playerId: "b", quantity: 1, value: 6 },
        { playerId: "a", quantity: 2, value: 6 },
    ],
    playerMap: {
        a: {
            id: "a",
            name: "alcus",
            emoji: "apple",
            dice: [
                { id: "1", value: 2, isVisible: false },
                { id: "2", value: 5, isVisible: false },
            ],
        },
        b: {
            id: "b",
            name: "ddod",
            emoji: "cherries",
            dice: [
                { id: "3", value: 6, isVisible: false },
                { id: "4", value: 6, isVisible: false },
            ],
        },
    },
    biddingQueue: ["b", "a"],
    timerStartTime: undefined,
    activeCall: undefined,
}
```

### Notes

None

## State `[8]`

### Request

```ts
trpc.v1.call.create.mutate({
  type: "SPOT_ON",
});
```

### Response

```ts
void
```

### Game state

```ts
{
   gameConfig: {
        allowRerolling: true,
        allowSpotOnCalls: true,
        showNumDice: false,
        turnTimeLimit: undefined,
        hideLogsDuringRound: true,
        countOnesAsWild: false,
        numDicePerPlayer: 2,
    },
    gameStatus: "ROUND_OVER",
    hostPlayerId: "a",
    activePlayerId: "b",
    previousBids: [
        { playerId: "b", quantity: 1, value: 6 },
        { playerId: "a", quantity: 2, value: 6 },
    ],
    playerMap: {
        a: {
            id: "a",
            name: "alcus",
            emoji: "apple",
            dice: [
                { id: "1", value: 2, isVisible: true },
                { id: "2", value: 5, isVisible: true },
            ],
        },
        b: {
            id: "b",
            name: "ddod",
            emoji: "cherries",
            dice: [
                { id: "3", value: 6, isVisible: true },
                { id: "4", value: 6, isVisible: true },
            ],
        },
    },
    biddingQueue: ["b", "a"],
    timerStartTime: undefined,
    activeCall: {
        type: "SPOT_ON",
        isCorrect: true,
        playerId: "b",
        effect: {
            playerId: "a",
            numDiceDelta: -1,
        },
    },
}
```

### Notes

- Only the active player has permission to execute this procedure
- The game status is set to `ROUND_OVER` if all players will have at least one
  die at the start of the next round
- The game status is set to `GAME_OVER` if only one player will have at least
  one die at the start of the next round
- All dice are made visible
- If the type of the call was `SPOT_ON`, the next active is the player that made
  the call
- If the type of the call was `CHALLENGE_bid`, the next active is the player that
  will lose a die at the start of the next round
- The bidding queue is "rotated"
- The active call is set

## State `[9]`

### Request

```ts
trpc.v1.game.startRound.mutate();
```

### Response

```ts
void
```

### Game state

```ts
{
   gameConfig: {
        allowRerolling: true,
        allowSpotOnCalls: true,
        showNumDice: false,
        turnTimeLimit: undefined,
        hideLogsDuringRound: true,
        countOnesAsWild: false,
        numDicePerPlayer: 2,
    },
    gameStatus: "AWAITING_BID",
    hostPlayerId: "a",
    activePlayerId: "b",
    previousBids: [],
    playerMap: {
        a: {
            id: "a",
            name: "alcus",
            emoji: "apple",
            dice: [
                { id: "1", value: 1, isVisible: false },
            ],
        },
        b: {
            id: "b",
            name: "ddod",
            emoji: "cherries",
            dice: [
                { id: "3", value: 2, isVisible: false },
                { id: "4", value: 2, isVisible: false },
            ],
        },
    },
    biddingQueue: ["b", "a"],
    timerStartTime: undefined,
    activeCall: undefined,
}
```

### Notes

- Only the active player has permission to execute this procedure
- The game status is set to `AWAITING_BID`
- The log of previous bids is reset
- Each player's dice are rolled

## State `[10]`

### Request

```ts
trpc.v1.bid.create.mutate({
  quantity: 1,
  value: 2,
});
```

### Response

```ts
void
```

### Game state

```ts
{
   gameConfig: {
        allowRerolling: true,
        allowSpotOnCalls: true,
        showNumDice: false,
        turnTimeLimit: undefined,
        hideLogsDuringRound: true,
        countOnesAsWild: false,
        numDicePerPlayer: 2,
    },
    gameStatus: "AWAITING_BID",
    hostPlayerId: "a",
    activePlayerId: "a",
    previousBids: [
        { playerId: "b", quantity: 1, value: 2 }
    ],
    playerMap: {
        a: {
            id: "a",
            name: "alcus",
            emoji: "apple",
            dice: [
                { id: "1", value: 1, isVisible: false },
            ],
        },
        b: {
            id: "b",
            name: "ddod",
            emoji: "cherries",
            dice: [
                { id: "3", value: 2, isVisible: false },
                { id: "4", value: 2, isVisible: false },
            ],
        },
    },
    biddingQueue: ["a", "b"],
    timerStartTime: undefined,
    activeCall: undefined,
}
```

### Notes

None

## State `[10]`

### Request

```ts
trpc.v1.dice.roll.mutate(["1"]);
```

### Response

```ts
void
```

### Game state

```ts
{
   gameConfig: {
        allowRerolling: true,
        allowSpotOnCalls: true,
        showNumDice: false,
        turnTimeLimit: undefined,
        hideLogsDuringRound: true,
        countOnesAsWild: false,
        numDicePerPlayer: 2,
    },
    gameStatus: "AWAITING_BID",
    hostPlayerId: "a",
    activePlayerId: "a",
    previousBids: [
        { playerId: "b", quantity: 1, value: 2 }
    ],
    playerMap: {
        a: {
            id: "a",
            name: "alcus",
            emoji: "apple",
            dice: [
                { id: "1", value: 6, isVisible: false },
            ],
        },
        b: {
            id: "b",
            name: "ddod",
            emoji: "cherries",
            dice: [
                { id: "3", value: 2, isVisible: false },
                { id: "4", value: 2, isVisible: false },
            ],
        },
    },
    biddingQueue: ["a", "b"],
    timerStartTime: undefined,
    activeCall: undefined,
}
```

### Notes

- Only the active player has permission to execute this procedure
- A player may only roll their own dice
- The dice with the IDs specified in the payload are rerolled

## State `[11]`

### Request

```ts
trpc.v1.bid.create.mutate({
  quantity: 1,
  value: 6,
});
```

### Response

```ts
void
```

### Game state

```ts
{
   gameConfig: {
        allowRerolling: true,
        allowSpotOnCalls: true,
        showNumDice: false,
        turnTimeLimit: undefined,
        hideLogsDuringRound: true,
        countOnesAsWild: false,
        numDicePerPlayer: 2,
    },
    gameStatus: "AWAITING_BID",
    hostPlayerId: "a",
    activePlayerId: "b",
    previousBids: [
        { playerId: "b", quantity: 1, value: 2 },
        { playerId: "a", quantity: 1, value: 6 },
    ],
    playerMap: {
        a: {
            id: "a",
            name: "alcus",
            emoji: "apple",
            dice: [
                { id: "1", value: 6, isVisible: false },
            ],
        },
        b: {
            id: "b",
            name: "ddod",
            emoji: "cherries",
            dice: [
                { id: "3", value: 2, isVisible: false },
                { id: "4", value: 2, isVisible: false },
            ],
        },
    },
    biddingQueue: ["b", "a"],
    timerStartTime: undefined,
    activeCall: undefined,
}
```

### Notes

None

## State `[12]`

### Request

```ts
trpc.v1.dice.reveal.mutate(["3"]);
```

### Response

```ts
void
```

### Game state

```ts
{
   gameConfig: {
        allowRerolling: true,
        allowSpotOnCalls: true,
        showNumDice: false,
        turnTimeLimit: undefined,
        hideLogsDuringRound: true,
        countOnesAsWild: false,
        numDicePerPlayer: 2,
    },
    gameStatus: "AWAITING_BID",
    hostPlayerId: "a",
    activePlayerId: "b",
    previousBids: [
        { playerId: "b", quantity: 1, value: 2 },
        { playerId: "a", quantity: 1, value: 6 },
    ],
    playerMap: {
        a: {
            id: "a",
            name: "alcus",
            emoji: "apple",
            dice: [
                { id: "1", value: 6, isVisible: false },
            ],
        },
        b: {
            id: "b",
            name: "ddod",
            emoji: "cherries",
            dice: [
                { id: "3", value: 2, isVisible: true },
                { id: "4", value: 2, isVisible: false },
            ],
        },
    },
    biddingQueue: ["b", "a"],
    timerStartTime: undefined,
    activeCall: undefined,
}
```

### Notes

- Only the active player has permission to execute this procedure
- A player may only reveal their own dice
- The dice with the IDs specified in the payload are made visible

## State `[13]`

### Request

```ts
trpc.v1.bid.create.mutate({
  quantity: 2,
  value: 2,
});
```

### Response

```ts
void
```

### Game state

```ts
{
   gameConfig: {
        allowRerolling: true,
        allowSpotOnCalls: true,
        showNumDice: false,
        turnTimeLimit: undefined,
        hideLogsDuringRound: true,
        countOnesAsWild: false,
        numDicePerPlayer: 2,
    },
    gameStatus: "AWAITING_BID",
    hostPlayerId: "a",
    activePlayerId: "a",
    previousBids: [
        { playerId: "b", quantity: 1, value: 2 },
        { playerId: "a", quantity: 1, value: 6 },
        { playerId: "b", quantity: 2, value: 2 },
    ],
    playerMap: {
        a: {
            id: "a",
            name: "alcus",
            emoji: "apple",
            dice: [
                { id: "1", value: 6, isVisible: false },
            ],
        },
        b: {
            id: "b",
            name: "ddod",
            emoji: "cherries",
            dice: [
                { id: "3", value: 2, isVisible: true },
                { id: "4", value: 2, isVisible: false },
            ],
        },
    },
    biddingQueue: ["a", "b"],
    timerStartTime: undefined,
    activeCall: undefined,
}
```

### Notes

None

## State `[14]`

### Request

```ts
trpc.v1.call.create.mutate({
  type: "CHALLENGE_BID",
});
```

### Response

```ts
void
```

### Game state

```ts
{
   gameConfig: {
        allowRerolling: true,
        allowSpotOnCalls: true,
        showNumDice: false,
        turnTimeLimit: undefined,
        hideLogsDuringRound: true,
        countOnesAsWild: false,
        numDicePerPlayer: 2,
    },
    gameStatus: "GAME_OVER",
    hostPlayerId: "a",
    activePlayerId: "a",
    previousBids: [
        { playerId: "b", quantity: 1, value: 2 },
        { playerId: "a", quantity: 1, value: 6 },
        { playerId: "b", quantity: 2, value: 2 },
    ],
    playerMap: {
        a: {
            id: "a",
            name: "alcus",
            emoji: "apple",
            dice: [
                { id: "1", value: 6, isVisible: true },
            ],
        },
        b: {
            id: "b",
            name: "ddod",
            emoji: "cherries",
            dice: [
                { id: "3", value: 2, isVisible: true },
                { id: "4", value: 2, isVisible: true },
            ],
        },
    },
    biddingQueue: ["a", "b"],
    timerStartTime: undefined,
    activeCall: {
      type: "CHALLENGE_BID",
      isCorrect: false,
      playerId: "a",
      effect: {
        playerId: "a",
        numDiceDelta: -1,
      },
    },
}
```

### Notes

None
