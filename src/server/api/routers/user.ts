import { protectedProcedure, createTRPCRouter } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    getUser: protectedProcedure
        .query(async ({ ctx }) => {
            const user = await ctx.db.user.findUniqueOrThrow({where: {id: ctx.session.user.id}});
            return user;
        }),
    setUserFreeTier: protectedProcedure 
        .mutation(async ({ ctx }) => {
            const ret = ctx.db.user.update({where:{id: ctx.session.user.id}, data:{tierId:"tier-pleb"}});
            return ret;
        }),
});
