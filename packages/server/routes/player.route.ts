import { Procedure, Router } from "../apps/trpc.app";

const router = Router({
  /** Updates the requester's player information. */
  update: Procedure.mutation(() => {
    throw new Error("Not implemented");
  }),
});

export default router;
