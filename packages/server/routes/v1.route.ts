import { Router } from "../apps/trpc.app";
import BidRouter from "./bid.route";
import CallRouter from "./call.route";
import DiceRouter from "./dice.route";
import GameRouter from "./game.route";
import PlayerRouter from "./player.route";

const router = Router({
  bid: BidRouter,
  call: CallRouter,
  dice: DiceRouter,
  game: GameRouter,
  player: PlayerRouter,
});

export default router;
