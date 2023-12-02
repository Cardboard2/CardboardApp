"use client";
import React from "react";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import StatisticBox from "./StatisticBox";
import UsageBar from "../../_components/UsageBar";

export interface AdminStatsInterface {
  "Total users": number;
  "Total usage (Mb)": number;
  "Total tier-pleb": number;
  "Total tier-normal": number;
  "Total tier-whale": number;
}

function AdminStatsList(props: { AdminListProps: UserListInterface[] }) {
  const [adminStats, updateAdminStats] = useState<AdminStatsInterface>({
    "Total users": 0,
    "Total usage (Mb)": 0,
    "Total tier-pleb": 0,
    "Total tier-normal": 0,
    "Total tier-whale": 0,
  });

  useEffect(() => {
    let usage = 0;
    let tiers = {
      "tier-pleb": 0,
      "tier-normal": 0,
      "tier-whale": 0,
    };

    for (let i = 0; i < props.AdminListProps.length; i++) {
      let currUser = props.AdminListProps[i];

      if (currUser?.usage) {
        usage += currUser.usage.userUsage;
      }
      if (currUser !== undefined) {
        switch (currUser.tierId) {
          case "tier-pleb":
            tiers["tier-pleb"] += 1;
            break;
          case "tier-normal":
            tiers["tier-normal"] += 1;
            break;
          case "tier-whale":
            tiers["tier-whale"] += 1;
            break;
        }
      }
    }

    updateAdminStats({
      "Total users": props.AdminListProps.length,
      "Total usage (Mb)": usage,
      "Total tier-pleb": tiers["tier-pleb"],
      "Total tier-normal": tiers["tier-normal"],
      "Total tier-whale": tiers["tier-whale"],
    });
  }, [props.AdminListProps]);

  return (
    <div>
      <div className="">
        <dl className="lg:grid-cols-0 mx-auto max-w-7xl grid-cols-1 sm:grid-cols-5 md:grid lg:px-2 xl:px-0">
          {Object.keys(adminStats).map((key) => (
            <StatisticBox
              title={key}
              statistic={adminStats[key as keyof AdminStatsInterface]}
            />
          ))}
        </dl>
      </div>
    </div>
  );
}

export interface UserListInterface {
  name: string;
  id: string;
  email: string;
  role: string;
  usage: {
    userUsage: number;
    totalStorage: number;
  };
  tierId: string;
  tierExpiry: Date;
}

export interface FileListInterface {
  id: string;
  name: string;
  type: string;
  size: number;
  awsKey: string;
  createdAt: Date;
  modifiedAt: Date;
}

function FileList(props: {
  FileListProps: FileListInterface[];
  SelectedUser: UserListInterface;
}) {
  return (
    <div>
      <div>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <b className=" leading-6 text-gray-900">
                User {props.SelectedUser.name} Files:
              </b>
            </div>
          </div>
          <div className="md: flex flex-col justify-between md:flex-row">
            <div className="flex-col">
              <p>
                <b>Email: </b>
                {props.SelectedUser.email}
              </p>
              <p>
                <b>Tier: </b> {props.SelectedUser.tierId}
              </p>
              <p>
                <b>Tier Expiry: </b>
                {props.SelectedUser.tierExpiry == null
                  ? ""
                  : props.SelectedUser.tierExpiry.toLocaleString()}
              </p>
            </div>
            <h1 className="md:hidden">
              <b>Statistics: </b>
            </h1>
            <div className=" md:flex md:flex-row">
              <StatisticBox
                title={"File Count"}
                statistic={props.FileListProps.length}
              />

              <StatisticBox
                title={"Total Usage (MB)"}
                statistic={
                  props.SelectedUser.usage.userUsage +
                  "/" +
                  props.SelectedUser.usage.totalStorage
                }
              />

              <StatisticBox
                title={"Total Usage (%)"}
                statistic={Math.round(
                  (props.SelectedUser.usage.userUsage /
                    props.SelectedUser.usage.totalStorage) *
                    100,
                )}
              />
            </div>
          </div>

          <div className="mt-5 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full overflow-hidden overflow-y-scroll py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Full Path Name
                      </th>
                      <th
                        scope="col"
                        className="float-right px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Size (MB)
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 ">
                    {props.FileListProps?.map((file: FileListInterface) => {
                      return (
                        <tr key={file.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            {file.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {file.type}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {file.awsKey}
                          </td>
                          <td className="float-right whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {file.size}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminView() {
  const [isAdmin, updateAdmin] = useState(false);
  const [fileView, setFileView] = useState(false);
  const [userList, updateItems] = useState<Array<UserListInterface>>([]);
  const [fileList, updateFileList] = useState<Array<FileListInterface>>([]);
  const [selectedUser, updateSelectedUser] = useState<UserListInterface>({
    name: "",
    id: "",
    email: "",
    role: "",
    usage: {
      userUsage: 0,
      totalStorage: 0,
    },
    tierId: "",
    tierExpiry: new Date(0),
  });

  useEffect(() => {
    getUsers.mutate();
  }, []);

  function getUserFiles(userId: string, user: UserListInterface) {
    getUserContents.mutate({ userId: userId });
    setFileView(true);
    updateSelectedUser(user);
  }

  // API calls
  const checkAdmin = api.admin.isAdmin.useQuery(undefined, {
    onSuccess: (data: boolean) => {
      if (data) {
        updateAdmin(data);
      }
    },
  });

  const getUsers = api.admin.getUsers.useMutation({
    onSuccess: (data) => {
      if (data) {
        console.log(data);
        updateItems(data);
      }
    },
  });

  const getUserContents = api.admin.getUserContents.useMutation({
    onSuccess: (data) => {
      if (data !== undefined && data !== null) {
        console.log(data);
        updateFileList(data);
      }
    },
  });

  // This code shouldn't be here lmao but like putting this here if u wanna test da functions
  // This code to promote user is to make admin for now....
  const promoteAdminAPI = api.admin.promoteAdmin.useMutation({
    onSuccess: () => {
      updateAdmin(true);
      getUsers.mutate();
    },
  });

  function promoteUser() {
    promoteAdminAPI.mutate();
  }

  const makeUserAPI = api.admin.makeUser.useMutation({
    onSuccess: () => {
      updateAdmin(false);
      getUsers.mutate();
    },
  });

  function makeUser() {
    makeUserAPI.mutate();
  }

  if (isAdmin == true) {
    if (fileView == false) {
      return (
        <div>
          <div className="flex flex-col gap-10 px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="mt-5 text-xl font-semibold leading-6 text-gray-900">
                  Admin Page | Users
                </h1>
              </div>
              <button
                className="float-right rounded-md bg-red-300 px-3 py-2"
                onClick={() => makeUser()}
              >
                Revoke Admin XDD (This is here for testing)
              </button>
            </div>
            <AdminStatsList AdminListProps={userList} />
            <div className="mt-3 flow-root lg:px-20">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Role
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Tier
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Tier Expiry
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Usage (MB)
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                        >
                          <span className="sr-only">View</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {userList?.map((user: UserListInterface) => {
                        return (
                          <tr key={user.email}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                              {user.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {user.email}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {user.role}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {user.tierId}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {user.tierExpiry == null
                                ? ""
                                : user.tierExpiry.toLocaleString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <a>
                                {" "}
                                {user.usage.userUsage} /{" "}
                                {user.usage.totalStorage}
                              </a>
                              <UsageBar
                                usage={user.usage.userUsage}
                                totalSpace={user.usage.totalStorage}
                              />
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                              <a
                                onClick={() => getUserFiles(user.id, user)}
                                className="cursor-pointer text-indigo-600 hover:text-indigo-900"
                              >
                                View
                                <span className="sr-only">, {user.name}</span>
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="flex flex-col gap-5 px-4 sm:px-6 lg:px-8">
            <button
              className=" width: auto mt-3 rounded-md bg-amber-300 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
              onClick={() => setFileView(false)}
            >
              Return to Users Page
            </button>
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className=" text-xl font-semibold leading-6 text-gray-900">
                  Admin Page | User Files
                </h1>
              </div>
            </div>
            <FileList FileListProps={fileList} SelectedUser={selectedUser} />
          </div>
        </div>
      );
    }
  } else {
    return (
      <div>
        <h1>
          This page would usually display the 404 not found page (if not
          authenticated), but since making an admin would be done in the
          backend, I added this button so u can experience being an admin lmao
        </h1>
        <button
          className="rounded-md bg-amber-300 px-3 py-2"
          onClick={() => promoteUser()}
        >
          Make admin :OO
        </button>
      </div>
    );
  }
}
