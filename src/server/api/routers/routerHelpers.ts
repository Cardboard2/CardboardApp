import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

interface TierInterface {
  "tier-pleb": number; // 10 MB
  "tier-normal": number; // 100 MB
  "tier-whale": number; // 1 GB
}

const TierSize: TierInterface = {
  "tier-pleb": 10000000, // 10 MB
  "tier-normal": 1e8, // 100 MB
  "tier-whale": 1e9, // 1 GB
};

export function getUserUsageStats(
  bytes: number | undefined | null,
  tierId: string | undefined | null,
) {
  const ret = {
    userUsage: 0,
    totalStorage: convertToMb(TierSize["tier-pleb"]), // Pleb by default
  };

  ret.userUsage = convertToMb(bytes);
  if (
    tierId !== "" &&
    tierId !== null &&
    tierId !== undefined &&
    tierId !== "tier-pleb"
  ) {
    ret.totalStorage = convertToMb(TierSize[tierId as keyof TierInterface]);
  }

  return ret;
}

export function convertToMb(bytes: number | undefined | null) {
  if (bytes && bytes !== null) {
    const sumMB = bytes / (1000 * 1000);
    return Math.round(sumMB * 100) / 100;
  } else {
    return 0;
  }
}

export async function calculateUsage(userId: string) {
  const sumResult = await db.file.aggregate({
    _sum: {
      size: true,
    },
    where: {
      createdById: userId,
    },
  });
  console.log(sumResult._sum);
  return sumResult._sum;
}

export async function updateUsage(userId: string, usage: number | null) {
  return await db.user.update({
    data: {
      usage: usage,
    },
    where: {
      id: userId,
    },
  });
}

function checkStorageLimit(tier: string, newSize: number) {
  if (tier == "") return false;

  if (newSize > TierSize[tier as keyof TierInterface]) {
    return false;
  }

  return true;
}

function checkTier(tierExpiry: Date) {
  const currDate = new Date();

  if (tierExpiry >= currDate) {
    return true;
  }
  return false;
}

// Check if the user is within limits
// Check if usage in date + new upload is within limits
export async function checkEligibity(userId: string, fileSize = 0) {
  const user = await db.user.findUniqueOrThrow({
    where: { id: userId },
  });

  if (user) {
    let currSize = 0;

    if (user.usage !== null) {
      currSize = user.usage;
    }

    let currTier = "";

    if (user.tierId !== null && user.tierId !== undefined) {
      currTier = user.tierId;
    }

    const newSize = fileSize + currSize;
    console.log(user);
    if (checkStorageLimit(currTier, newSize) == false) {
      console.log("out of limit");
      return {
        allowed: false,
        message: "Out of storage limit",
      };
    }

    if (user.tierExpiry !== null && user.tierExpiry !== undefined) {
      if (checkTier(user.tierExpiry) == false) {
        console.log("out of tier");
        return {
          allowed: false,
          message: "Subscription expired",
        };
      }
    }

    return {
      allowed: true,
      usage: newSize,
      tierSize: TierSize[currTier as keyof TierInterface],
    };
  }
}

export async function makePleb(userId: string) {
  return await db.user.update({
    data: {
      tierId: "tier-pleb",
    },
    where: {
      id: userId,
    },
  });
}

// export interface UserListInterface {
//   id: string;
//   name: string;
//   email: string;
//   emailVerified: string;
//   image: string;
//   rootId: string;
//   tierId: string;
//   role: string;
//   usage: number;
//   tierExpiry: Date;
// }

// setInterval(() => {
//   console.log("checking subscriptions");
//   checkSubscriptions();
//   // Get all users
//   // check if their subscription is expiring
//   // If so, charge account
//   // If charge fials, make pleb
// }, 60000); // Every 24 hrs check user subscriptions?
// //8.64e7
// async function checkSubscriptions() {
//   const currDate = new Date();
//   const userList: Array<UserListInterface> =
//     await db.$queryRaw`SELECT * from user where not tierId='tier-pleb' and ${currDate}>tierExpiry`;

//   console.log(userList);
//   if (userList) {
//     for (let i = 0; i < userList.length; i++) {
//       let a = await chargeAccount()
//     }
//   }
// }

// async function chargeAccount() {
//   if (true) {
//     return true;
//   } else {
//     return false;
//   }
// }
