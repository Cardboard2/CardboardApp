import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "~/server/api/trpc";
import { convertToMb, getUserUsageStats, makePleb } from "./routerHelpers";

import type { FileListInterface } from "~/app/admin/_components/FileList";
import type { UserListInterface } from "~/app/admin/_components/UserList";

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
          name: currUser?.name ?? "Unknown",
          id: currUser?.id,
          email: currUser?.email ?? "Unknown",
          role: currUser?.role ?? "Unknown",
          usage: getUserUsageStats(currUser?.usage, currTier),
          tierId: currTier ?? "Unknown",
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

        let responseList: FileListInterface[] = [];
        if (userContents) {
          for (const currFile of userContents) {
            const tmp: FileListInterface = {
              id: currFile?.id,
              name: currFile?.name ?? "Unknown",
              type: currFile?.type ?? "Unknown",
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
