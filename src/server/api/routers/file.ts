import { z } from "zod";
import { FileDetail, defaultFileDetail } from "~/app/dashboard/_components/FileDetail";
import { protectedProcedure, createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { api } from "~/trpc/server";
import { getBaseUrl } from "~/trpc/shared";

interface SharedFileObject {
    file: FileDetail
    url: string
}

export const fileRouter = createTRPCRouter({
    makeFileSharable: protectedProcedure
        .input(z.object({id: z.string()}))
        .mutation(async ({ input, ctx }) => {
            const ret = await ctx.db.user.findUnique({where: {id: ctx.session.user.id}, include: {files: {where: {id: input.id}}}});
            
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
    getSharedFile: publicProcedure
        .input(z.object({id: z.string()}))
        .query(async ({ input, ctx }) => {
            if (input.id != "") {
                const ret = await ctx.db.file.findUnique({where: {id: input.id, shared: true}});

                if (ret) {
                    const downloadUrl = await api.aws.getSharedFileDownloadUrl.query({id: ret.id});

                    const returnObj : SharedFileObject = {
                        file: {
                            id: ret.id,
                            name: ret.name,
                            objectType: "File",
                            type: ret.type,
                            size: ret.size,
                            createdAt: ret.createdAt,
                            modifiedAt: ret.updatedAt
                        },
                        url: downloadUrl
                    };

                    return returnObj;
                }
            }
            
            const defaultReturn : SharedFileObject = {
                file: defaultFileDetail,
                url: ""
            };

            return defaultReturn;
        }),
});