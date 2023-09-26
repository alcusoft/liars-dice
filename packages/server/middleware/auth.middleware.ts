import { Middleware } from "../apps/trpc.app";

/** Validates the requester's auth token and extracts their player ID. */
const middleware = Middleware((opts) => {
  console.error("Not implemented");
  return opts.next();
});

export default middleware;
