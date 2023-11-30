import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "~/server/api/trpc";
import { getBaseUrl } from "~/trpc/shared";

export const fileRouter = createTRPCRouter({
    makeFileSharable: protectedProcedure
        .input(z.object({id: z.string()}))
        .mutation(async ({ input, ctx }) => {
            const ret = await ctx.db.user.findUniqueOrThrow({where: {id: ctx.session.user.id}, include: {files: {where: {id: input.id}}}});
            
            if (ret?.files.length) {
                const file = ret.files[0];
                if (file?.shared == false) {
                    const updatedFile = await ctx.db.file.update({where: {id: input.id}, data: {shared: true}});
                    if (updatedFile?.shared)
                        return (getBaseUrl() + "/sharedfile?id=" + updatedFile.id);
                }
                else if (file?.shared == true)
                    return (getBaseUrl() + "/sharedfile?id=" + file.id);
                else
                    return ("err");
            }
        }),
});