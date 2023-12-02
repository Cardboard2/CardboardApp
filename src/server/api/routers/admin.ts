import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "~/server/api/trpc";
import { convertToMb, getUserUsageStats, makePleb } from "./routerHelpers";

export interface UserListInterface {
  name: string | null | undefined;
  id: string | null | undefined;
  email: string | null | undefined;
  role: string | null | undefined;
  usage: {
    userUsage: number | null | undefined;
    totalStorage: number | null | undefined;
  };
  tierId: string | null | undefined;
  tierExpiry: Date | null | undefined;
}

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

      let responseList: UserListInterface[] = [];

      for (const currUser of userList) {
        let currTier = currUser?.tierId;
        if (
          currUser?.tierId == undefined ||
          currUser?.tierId == null ||
          currUser?.tierId == ""
        ) {
          currTier = "tier-pleb";
          if (currUser?.id !== undefined) makePleb(currUser?.id);
        }

        const tmp: UserListInterface = {
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

        let responseList = new Array();
        if (userContents) {
          for (const currFile of userContents) {
            const tmp = {
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
