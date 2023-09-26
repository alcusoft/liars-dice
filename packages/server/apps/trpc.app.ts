import { initTRPC } from "@trpc/server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";

const app = initTRPC.create();

export const Router = app.router;
export const Procedure = app.procedure;
export const Middleware = app.middleware;

import V1Router from "../routes/v1.route";
const appRouter = Router({ v1: V1Router });

const server = createHTTPServer({ router: appRouter });
const port = 4000;
server.listen(port);

server.server.on("listening", () => {
  console.log(`tRPC server started on port ${port}`);
});

export type AppRouter = typeof appRouter;
