import { awsRouter } from "~/server/api/routers/aws";
import { stripeRouter } from './routers/stripe';
import { userRouter } from './routers/user';
import { createTRPCRouter } from "~/server/api/trpc";
import { fileRouter } from "./routers/file";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  aws     : awsRouter,
  stripe  : stripeRouter,
  user    : userRouter,
  file    : fileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
