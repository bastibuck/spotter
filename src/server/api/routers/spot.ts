import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const spotRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.db.query.spots.findMany()),
});
