import { Middleware } from "../apps/trpc.app";

/**
 * Strips the game state of any information that the requester does not have
 * permission to see.
 */
const middleware = Middleware((opts) => {
  console.error("Not implemented");
  return opts.next();
});

export default middleware;
