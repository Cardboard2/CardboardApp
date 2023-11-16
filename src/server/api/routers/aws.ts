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

// Set your AWS credentials and S3 bucket information
const region = process.env.AWS_REGION ?? "";
const accessKeyId = process.env.AWS_ACCESS_KEY ?? "";
const secretAccessKey = process.env.AWS_SECRET_KEY ?? "";
const bucketName = process.env.AWS_BUCKET_NAME ?? "";

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
  fileStream: any,
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
  s3Client
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
    .then((data) => {
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

  return getSignedUrl(s3Client, command, { expiresIn: 60 * expiryMinutes });
}

// TPRC Imports
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

async function calculate(ctx: any) {}

export const awsRouter = createTRPCRouter({
  // Get the root folder and return its contents
  // If no root folder exists, create one and return nothing
  getRootFiles: protectedProcedure.mutation(async ({ ctx }) => {
    // TODO: Get the root folder for the current user
    // Query user model for rootId, if null=create else get the folder files

    ctx.db.user
      .findFirst({
        where: { id: ctx.session.user.id },
      })
      .then((result) => {
        if (result && result["rootId"] == null) {
          console.log("creating folder");
          console.log(String(ctx.session.user.id) + "/");
          ctx.db.folder
            .create({
              data: {
                name: ctx.session.user.id,
                ownedBy: { connect: { id: ctx.session.user.id } },
                path: String(ctx.session.user.id) + "/",
              },
            })
            .then((createResponse) => {
              ctx.db.user
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
        var extension: string = "";

        if (input.request.oldName.includes(".")) {
          let extensionSplit = input.request.oldName.split(".")[1];

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
      }
    }),

  uploadFile: protectedProcedure
    .input(
      z.object({
        file: z.any(),
        metadata: z.object({
          lastModified: z.number(),
          lastModifiedDate: z.date(),
          name: z.string(),
          size: z.number(),
          type: z.string(),
          folderId: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      var metadata = input.metadata;
      console.log(metadata);
      // console.log(input.file.size);
      var fileChanged = false;

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
        const newFile = await ctx.db.file.create({
          data: {
            name: metadata.name,
            ownedBy: { connect: { id: ctx.session.user.id } },
            type: metadata.type,
            size: metadata.size,
            parentFolder: { connect: { id: folder?.id } },
            awsKey: folder?.path + metadata.name,
            modifiedAt: new Date(metadata.lastModifiedDate),
          },
        });

        if (newFile.id) {
          fileChanged = true;
        }
      } else if (existingFile.id !== "") {
        // Update the metadata of the file
        console.log(metadata.name + " already exists");

        const newFile = await ctx.db.file.update({
          where: {
            id: existingFile.id,
            createdById: ctx.session.user.id,
          },
          data: {
            type: metadata.type,
            size: metadata.size,
            modifiedAt: new Date(),
          },
        });

        fileChanged = true;
      }

      // If a file has been updated, upload the new object to s3
      if (fileChanged == true) {
        let data = Buffer.from(input.file, "base64");
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
      var parentFolder = await ctx.db.folder.findFirst({
        where: {
          id: input.request.parentId,
          createdById: ctx.session.user.id,
        },
      });

      console.log("parentFolder is " + parentFolder);

      if (parentFolder) {
        var newFolder = await ctx.db.folder
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
            .then((res) => {
              folder = res;
              if (res !== null && res.id !== null) {
                ctx.db.user
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
      console.log("creating folder return");
      console.log(folder);
      if (folder) {
        console.log("folder found");
        console.log(folder);
        var responseList = new Array();

        var response = {
          name: folder.name,
          folderId: folder.id,
          childList: responseList,
        };

        // Add the parent to go back
        if (folder.parentId) {
          let tmp = {
            objectFile: "Folder",
            id: folder.parentId,
            name: "..",
          };

          responseList.push(tmp);
        }

        if (folder.folders) {
          for (let i = 0; i < folder.folders.length; i++) {
            let currFile = folder.folders[i];

            let tmp = {
              objectFile: "Folder",
              id: currFile?.id,
              name: currFile?.name,
            };

            responseList.push(tmp);
          }
        }

        if (folder.files) {
          for (let i = 0; i < folder.files.length; i++) {
            let currFile = folder.files[i];

            let tmp = {
              objectFile: "File",
              id: currFile?.id,
              name: currFile?.name,
              type: currFile?.type,
              size: currFile?.size,
              createdAt: currFile?.createdAt,
              modifiedAt: currFile?.modifiedAt,
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
    const sumResult = await ctx.db.file.aggregate({
      _sum: {
        size: true,
      },
      where: {
        createdById: ctx.session.user.id,
      },
    });

    if (sumResult._sum && sumResult._sum.size !== null) {
      const sumMB = sumResult._sum.size / (1000 * 1000);
      return sumMB;
    }
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
        let url = await createPresignedUrl(bucketName, file?.awsKey, file.name);
        return {
          fileName: file.name,
          link: url,
        };
      }
    }),
});
