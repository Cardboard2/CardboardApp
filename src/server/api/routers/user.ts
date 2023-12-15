import { protectedProcedure, createTRPCRouter } from "~/server/api/trpc";
import { api } from "~/trpc/server";

export interface UserData {
    name: string
    email: string
    image?: string
    usage?: number
    tierId: string
    tierExpiry: Date | null
}

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    let user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });

    if (!user)
        return null;
    else {
      if (!user.tierId) {
        user = await ctx.db.user.update({
          where: { id: user.id },
          data: { tierId: "tier-pleb" },
        });
      }

      const userData : UserData = {
          name: user.name ?? "",
          email: user.email ?? "",
          image: user.image ?? "",
          usage: user.usage ?? 0,
          tierId: user.tierId ?? "tier-pleb",
          tierExpiry: user.tierExpiry
      }
      return userData;
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
