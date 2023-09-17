import { Middleware } from "../apps/trpc.app";

/** Checks whether the requester has permission to execute the procedure. */
const middleware = Middleware((opts) => {
  console.error("Not implemented");
  return opts.next();
});

export default middleware;
