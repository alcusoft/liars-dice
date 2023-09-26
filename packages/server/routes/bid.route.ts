import { Procedure, Router } from "../apps/trpc.app";

const router = Router({
  /* Creates a new bid by the active player. */
  create: Procedure?.mutation(() => {
    throw new Error("Not implemented");
  }),
});

export default router;
