import { protectedProcedure, createTRPCRouter } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
    return {
      name: user?.name,
      email: user?.email,
      image: user?.image,
      usage: user?.usage,
      tierId: user?.tierId,
      tierExpiry: user?.tierExpiry,
    };
  }),
  setUserFreeTier: protectedProcedure.mutation(async ({ ctx }) => {
    const ret = await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: { tierId: "tier-pleb" },
    });
    return ret;
  }),

  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const ret = await ctx.db.user.delete({
      where: { id: ctx.session.user.id },
    });
    return ret;
  }),

  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: { tierId: "tier-pleb", tierExpiry: null },
    });
    return {
      name: user?.name,
      email: user?.email,
      image: user?.image,
      usage: user?.usage,
      tierId: user?.tierId,
      tierExpiry: user?.tierExpiry,
    };
  }),
});
