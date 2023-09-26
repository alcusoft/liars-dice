import { Procedure, Router } from "../apps/trpc.app";

const router = Router({
  /** Creates a new call by the active player against the latest bid. */
  create: Procedure.mutation(() => {
    throw new Error("Not implemented");
  }),
});

export default router;
