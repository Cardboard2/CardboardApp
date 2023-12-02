import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "~/server/api/trpc";
import { convertToMb, getUserUsageStats, makePleb } from "./routerHelpers";

export const adminRouter = createTRPCRouter({
  isAdmin: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
    });

    if (user && user.role == "Admin") {
      return true;
    } else {
      return false;
    }
  }),

  getUsers: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
    });

    if (user && user.role == "Admin") {
      const userList = await ctx.db.user.findMany({});

      var responseList = new Array();

      for (let i = 0; i < userList.length; i++) {
        let currUser = userList[i];
        let currTier = currUser?.tierId;
        if (
          currUser?.tierId == undefined ||
          currUser?.tierId == null ||
          currUser?.tierId == ""
        ) {
          currTier = "tier-pleb";
          if (currUser?.id !== undefined) makePleb(currUser?.id);
        }

        let tmp = {
          name: currUser?.name,
          id: currUser?.id,
          email: currUser?.email,
          role: currUser?.role,
          usage: getUserUsageStats(currUser?.usage, currTier),
          tierId: currUser?.tierId,
          tierExpiry: currUser?.tierExpiry,
        };

        responseList.push(tmp);
      }
      console.log(responseList);
      return responseList;

      // console.log(userList);
    }
  }),

  getUserContents: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUniqueOrThrow({
        where: { id: ctx.session.user.id },
      });

      if (user && user.role == "Admin") {
        console.log("wow an admin!!");

        const userContents = await ctx.db.file.findMany({
          where: {
            createdById: input.userId,
          },
        });

        var responseList = new Array();
        if (userContents) {
          for (let i = 0; i < userContents.length; i++) {
            let currFile = userContents[i];

            let tmp = {
              id: currFile?.id,
              name: currFile?.name,
              type: currFile?.type,
              size: convertToMb(currFile?.size),
              awsKey: currFile?.awsKey,
              createdAt: currFile?.createdAt,
              modifiedAt: currFile?.updatedAt,
            };

            responseList.push(tmp);
          }
        }

        return responseList;

        // console.log(userList);
      }
    }),

  promoteAdmin: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: { role: "Admin" },
    });
  }),

  makeUser: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: { role: "User" },
    });
  }),
});
