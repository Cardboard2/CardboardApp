// AWS Function imports
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { calculateUsage, checkEligibity, updateUsage } from "./routerHelpers";

// Set your AWS credentials and S3 bucket information
const region = process.env.USER_AWS_REGION ?? "";
const accessKeyId = process.env.USER_AWS_ACCESS_KEY ?? "";
const secretAccessKey = process.env.USER_AWS_SECRET_KEY ?? "";
const bucketName = process.env.USER_AWS_BUCKET_NAME ?? "";

// Create an S3 client
const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// // ============= Uploading object ======================
async function uploadObject(
  bucketName: string,
  key: string,
  fileStream: Buffer,
  type: string,
) {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileStream,
    ContentType: type,
  };

  // Upload the file to S3
  const uploadCommand = new PutObjectCommand(params);
  await s3Client
    .send(uploadCommand)
    .then((data) => {
      console.log("File uploaded successfully");
      console.log(data);
    })
    .catch((err) => {
      console.error("Error uploading file:", err);
    });
}

// // ============= deleting object ======================
async function deleteObject(bucketName: string, key: string) {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  // Delete the file from S3
  const deleteCommand = new DeleteObjectCommand(params);
  await s3Client
    .send(deleteCommand)
    .then((data) => {
      console.log("File deleted successfully");
      console.log(data);
      return true;
    })
    .catch((err) => {
      console.error("Error deleting file:", err);
      return false;
    });
}

// // ============= rename object ======================
async function renameObject(
  bucketName: string,
  oldkey: string,
  newKey: string,
) {
  const copyParams = {
    Bucket: bucketName,
    CopySource: bucketName + "/" + oldkey,
    Key: newKey,
  };

  const deleteParams = {
    Bucket: bucketName,
    Key: oldkey,
  };

  console.log(copyParams);

  // Delete the file from S3
  const copyCommand = new CopyObjectCommand(copyParams);
  const deleteCommand = new DeleteObjectCommand(deleteParams);

  await s3Client
    .send(copyCommand)
    .then(() => {
      s3Client
        .send(deleteCommand)
        .then((data) => {
          console.log("Rename successful");
          console.log(data);
          return true;
        })
        .catch((err) => {
          console.error("Error renaming file:", err);
          return false;
        });
    })
    .catch((err) => {
      console.error("Error renaming file:", err);
      return false;
    });
}

// // ============= list objects ======================
async function listObjects(bucketName: string, path: string) {
  const input = {
    // ListObjectsV2Request
    Bucket: bucketName, // required
    Prefix: path,
  };
  const command = new ListObjectsV2Command(input);
  const response = await s3Client
    .send(command)
    .then((data) => {
      console.log("Got the list of files");
      return data;
    })
    .catch((err) => {
      console.error("Error getting list of files:", err);
      return null;
    });

  return response;
}

// // ============= create presigned url ======================
async function createPresignedUrl(
  bucketName: string,
  key: string,
  fileName: string,
) {
  const expiryMinutes = 15;
  const input = {
    Bucket: bucketName, // required
    Key: key,
    ResponseContentDisposition: `attachment; filename="${fileName}"`,
  };

  const command = new GetObjectCommand(input);

  return await getSignedUrl(s3Client, command, {
    expiresIn: 60 * expiryMinutes,
  });
}

// // ============= create presigned url ======================
async function getInlineUrl(bucketName: string, key: string) {
  const expiryMinutes = 15;
  const input = {
    Bucket: bucketName, // required
    Key: key,
    ResponseContentDisposition: `inline`,
  };

  const command = new GetObjectCommand(input);

  return await getSignedUrl(s3Client, command, {
    expiresIn: 60 * expiryMinutes,
  });
}

// TPRC Imports
import { z } from "zod";
import type { FileDetail } from "~/app/dashboard/_components/FileDetail";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const awsRouter = createTRPCRouter({
  // Get the root folder and return its contents
  // If no root folder exists, create one and return nothing
  getRootFiles: protectedProcedure.mutation(async ({ ctx }) => {
    // TODO: Get the root folder for the current user
    // Query user model for rootId, if null=create else get the folder files

    await ctx.db.user
      .findFirst({
        where: { id: ctx.session.user.id },
      })
      .then(async (result) => {
        if (result && result.rootId == null) {
          console.log("creating folder");
          console.log(String(ctx.session.user.id) + "/");
          await ctx.db.folder
            .create({
              data: {
                name: ctx.session.user.id,
                ownedBy: { connect: { id: ctx.session.user.id } },
                path: String(ctx.session.user.id) + "/",
              },
            })
            .then(async (createResponse) => {
              await ctx.db.user
                .update({
                  where: {
                    id: ctx.session.user.id,
                  },
                  data: {
                    rootId: createResponse.id,
                  },
                })
                .then((res) => console.log(res));
            });
        } else {
          console.log("yo");
          //Get the root contents
          //prob will be a list of files (hoping its json)
        }
      });
  }),

  // updateFileNames
  // Path = AWS KEY
  // Relative path in db will be parentFolderPath + name
  // Sending to AWS will involve, moving from old awsKey to relativePath
  // 1. just need to CopyObject() with awsKey and relativePath and DeleteObjectCommand() with awsKey
  // 2. Update awsKey to reflect the relativePath
  // 3. awsKey should match parentFolderPath + name

  renameFile: protectedProcedure
    .input(
      z.object({
        request: z.object({
          newName: z.string(),
          oldName: z.string(),
          folderId: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const file = await ctx.db.file.findFirst({
        where: {
          createdById: ctx.session.user.id,
          name: input.request.oldName,
          parentId: input.request.folderId,
        },
      });

      const parentFolder = await ctx.db.folder.findFirst({
        where: {
          id: input.request.folderId,
          createdById: ctx.session.user.id,
        },
      });

      if (file && parentFolder) {
        let extension = "";

        if (input.request.oldName.includes(".")) {
          const extensionSplit = input.request.oldName.split(".")[1];

          if (extensionSplit) {
            extension = "." + extensionSplit;
          }
        }

        const newFileName = input.request.newName + extension;
        const oldAwsKey = file?.awsKey;
        const newAwsKey = parentFolder.path + newFileName;

        // Check if name already exists in db
        const checkName = await ctx.db.file.findFirst({
          where: {
            createdById: ctx.session.user.id,
            name: newFileName,
            parentId: input.request.folderId,
          },
        });

        if (checkName)
          return {
            error: { code: 400, message: "file already exists" },
          };

        // Check if awsKey already exists in db
        const checkKey = await ctx.db.file.findFirst({
          where: {
            awsKey: newAwsKey,
            createdById: ctx.session.user.id,
          },
        });

        if (checkKey)
          return {
            error: { code: 500, message: "file already exists" },
          };

        // All checks past, try to update db
        // Try to update in db
        const updatedFile = await ctx.db.file.update({
          where: {
            id: file.id,
          },
          data: {
            name: newFileName,
            awsKey: newAwsKey,
          },
        });

        // If updatedFile is returning non null,  update in aws
        if (updatedFile) {
          return renameObject(bucketName, oldAwsKey, newAwsKey);
        }
      }
    }),

  // NOTE: a folder's path = {path}/currentfolderName/
  // updateFolderName
  // Check if folder path can exist or not (unique)
  // Update the folder object's name  and path
  // Get all files with parentFolderId
  // For all files, run updateFileNames for each file (replacing and updateing each awsKey)
  // Get all folders with parentFolderId
  // For all folders, run updateFolderName
  // Delete the current folder

  // delete files
  // Get the file with with the parentId and name, delete using DeleteObjectCommand

  // delete folder
  // aws :  need to delete all entries within the folder then delete
  // delete folder should cascade files/folders below

  // download files
  // presigned url something sometin

  deleteFile: protectedProcedure
    .input(
      z.object({
        request: z.object({
          name: z.string(),
          folderId: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("deleting file");
      const file = await ctx.db.file.findFirst({
        where: {
          createdById: ctx.session.user.id,
          name: input.request.name,
          parentId: input.request.folderId,
        },
      });

      if (file) {
        console.log("deleting...");
        const deleted = await ctx.db.file.delete({
          where: {
            id: file.id,
          },
        });

        deleteObject(bucketName, deleted.awsKey);

        const totalUsage = await calculateUsage(ctx.session.user.id);
        console.log(totalUsage);
        if (totalUsage !== null) {
          updateUsage(ctx.session.user.id, totalUsage.size);
        }
      }
    }),

  uploadFile: protectedProcedure
    .input(
      z.object({
        file: z.string(),
        metadata: z.object({
          name: z.string(),
          size: z.number(),
          type: z.string(),
          folderId: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const metadata = input.metadata;
      console.log(metadata);

      // console.log(input.file.size);
      let fileChanged = false;

      const folder = await ctx.db.folder.findFirst({
        where: {
          id: metadata.folderId,
          createdById: ctx.session.user.id,
        },
      });

      // check if file exists already in db
      // If yes, update metadata and upload to s3
      // If not, create new file and upload to s3

      const existingFile = await ctx.db.file.findFirst({
        where: {
          createdById: ctx.session.user.id,
          name: metadata.name,
          parentId: metadata.folderId,
        },
      });

      if (existingFile == null) {
        // If yes, update metadata and upload to s3
        // First check eligibity of new file

        // First check eligibility to upload
        const newEligiblity = await checkEligibity(
          ctx.session.user.id,
          metadata.size,
        );
        console.log("asdasds");
        console.log(newEligiblity);

        if (newEligiblity && !newEligiblity["allowed"]) {
          console.log("not allowed new file");
          return false;
        }

        // Then upload the new file
        const newFile = await ctx.db.file.create({
          data: {
            name: metadata.name,
            ownedBy: { connect: { id: ctx.session.user.id } },
            type: metadata.type,
            size: metadata.size,
            parentFolder: { connect: { id: folder?.id } },
            awsKey: folder?.path + metadata.name,
          },
        });

        if (newFile.id) {
          fileChanged = true;
        }
      } else {
        // Update existing file
        // Update the metadata of the file

        // First check eligibility to upload new file
        // Calculate sizeDiff (this would be the updated usage with the old file replaced with the new one)
        let sizeDiff = metadata.size - existingFile.size;

        const newEligiblity = await checkEligibity(
          ctx.session.user.id,
          sizeDiff,
        );
        console.log("asdasds");
        console.log(newEligiblity);

        if (newEligiblity && !newEligiblity["allowed"]) {
          console.log("not allowed existing file");
          return false;
        }

        console.log(metadata.name + " already exists");

        await ctx.db.file.update({
          where: {
            id: existingFile.id,
            createdById: ctx.session.user.id,
          },
          data: {
            type: metadata.type,
            size: metadata.size,
          },
        });

        fileChanged = true;
      }

      // If a file has been updated, upload the new object to s3
      if (fileChanged == true) {
        // Update the user's usage
        const totalUsage = await calculateUsage(ctx.session.user.id);
        console.log(totalUsage);
        if (totalUsage !== null) {
          updateUsage(ctx.session.user.id, totalUsage.size);
        }

        const data = Buffer.from(input.file, "base64");
        return uploadObject(
          bucketName,
          folder?.path + metadata.name,
          data,
          metadata.type,
        );
      }
    }),

  createFolder: protectedProcedure
    .input(
      z.object({
        request: z.object({
          name: z.string(),
          parentId: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Try to create the file
      // If file already exists, since path is unique it will preven tfile from creating
      const parentFolder = await ctx.db.folder.findFirst({
        where: {
          id: input.request.parentId,
          createdById: ctx.session.user.id,
        },
      });

      console.log("parentFolder is ", parentFolder);

      if (parentFolder) {
        const newFolder = await ctx.db.folder
          .create({
            data: {
              name: input.request.name,
              ownedBy: { connect: { id: ctx.session.user.id } },
              path: parentFolder.path + input.request.name + "/",
              parentFolder: { connect: { id: parentFolder.id } },
            },
          })
          .catch((error) => {
            console.log(error);
          });

        return newFolder;
      }
    }),

  getFolderContents: protectedProcedure
    .input(z.object({ folderId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      let folder;

      // If folderId empty, means first running the application and return root folder
      // If folderId not empty, find the folder

      // Empty value for folderId
      // Get the root folder and use it, if it don't exist create it
      if (input.folderId === "") {
        folder = await ctx.db.folder.findFirst({
          where: {
            parentId: null,
            createdById: ctx.session.user.id,
          },
          include: {
            folders: true,
            files: true,
          },
        });

        // If root doesn't exist, create it and use it
        if (folder == null) {
          // Root doesnt exist, create it
          folder = await ctx.db.folder
            .create({
              data: {
                name: ctx.session.user.id,
                ownedBy: { connect: { id: ctx.session.user.id } },
                path: String(ctx.session.user.id) + "/",
              },
              include: {
                folders: true,
                files: true,
              },
            })
            .then(async (res) => {
              folder = res;
              if (res?.id !== null) {
                await ctx.db.user
                  .update({
                    where: {
                      id: ctx.session.user.id,
                    },
                    data: {
                      rootId: res.id,
                    },
                  })
                  .then((res) => console.log(res));
              }
            });
        }
      } else {
        // Non empty value for folderId
        // Get the folder
        folder = await ctx.db.folder.findFirst({
          where: {
            id: input.folderId,
            createdById: ctx.session.user.id,
          },
          include: {
            folders: true,
            files: true,
          },
        });
      }

      // Parse the folder's contents to be returned
      // 1) previous folder
      // 2) child folders
      // 3) child files
      // console.log("creating folder return");
      // console.log(folder);
      if (folder) {
        console.log("folder found");
        console.log(folder);
        const responseList: FileDetail[] = [];

        const response = {
          name: folder.name,
          folderId: folder.id,
          childList: responseList,
        };

        // Add the parent to go back
        if (folder.parentId) {
          const tmp = {
            objectType: "Folder",
            id: folder.parentId,
            name: "..",
          };

          responseList.push(tmp);
        }

        if (folder.folders) {
          for (const currFile of folder.folders) {
            const tmp = {
              objectType: "Folder",
              id: currFile?.id ?? "Unknown",
              name: currFile?.name ?? "Unknown",
            };

            responseList.push(tmp);
          }
        }

        if (folder.files) {
          for (const currFile of folder.files) {
            const tmp = {
              objectType: "File",
              id: currFile?.id ?? "Unknown",
              name: currFile?.name ?? "Unknown",
              type: currFile?.type,
              size: currFile?.size,
              createdAt: currFile?.createdAt,
              modifiedAt: currFile?.updatedAt,
            };

            responseList.push(tmp);
          }
        }

        console.log(response);
        return response;
      }
    }),

  // getFiles: publicProcedure.mutation(async ({ ctx }) => {
  //   return listObjects(bucketName, "destination/").then((data) => {
  //     console.log(data?.Contents);
  //     return data?.Contents;
  //   });
  // }),

  getUserUsage: protectedProcedure.mutation(async ({ ctx }) => {
    console.log(await calculateUsage(ctx.session.user.id));
  }),

  getDownloadLink: protectedProcedure
    .input(
      z.object({
        request: z.object({
          name: z.string(),
          folderId: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input);

      const file = await ctx.db.file.findFirst({
        where: {
          createdById: ctx.session.user.id,
          name: input.request.name,
          parentId: input.request.folderId,
        },
      });

      console.log(file);

      if (file?.awsKey) {
        console.log(file);
        const url = await createPresignedUrl(
          bucketName,
          file?.awsKey,
          file.name,
        );
        return {
          fileName: file.name,
          link: url,
        };
      }
    }),

  getInlineUrl: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const ret = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          files: {
            where: {
              id: input.id,
            },
          },
        },
      });
      if (ret?.files?.length) {
        const file = ret.files[0];
        if (file?.awsKey) return await getInlineUrl(bucketName, file.awsKey);
      } else {
        const file = await ctx.db.file.findUnique({ where: { id: input.id } });
        if (file?.shared && file.awsKey)
          return await getInlineUrl(bucketName, file.awsKey);
      }

      return "";
    }),

  queryDownloadLink: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const ret = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          files: {
            where: {
              id: input.id,
            },
          },
        },
      });
      if (ret?.files?.length) {
        const file = ret.files[0];
        if (file?.awsKey)
          return await createPresignedUrl(bucketName, file.awsKey, file.name);
      } else {
        const file = await ctx.db.file.findUnique({ where: { id: input.id } });
        if (file?.shared && file.awsKey)
          return await getInlineUrl(bucketName, file.awsKey);
      }

      return "";
    }),

  getSharedFileDownloadUrl: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const file = await ctx.db.file.findUnique({ where: { id: input.id } });
      if (file?.shared && file.awsKey)
        return await createPresignedUrl(bucketName, file.awsKey, file.name);

      return "";
    }),

  getSharedFileInlineUrl: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const file = await ctx.db.file.findUnique({ where: { id: input.id } });
      if (file?.shared && file.awsKey)
        return await getInlineUrl(bucketName, file.awsKey);

      return "";
    }),
});
