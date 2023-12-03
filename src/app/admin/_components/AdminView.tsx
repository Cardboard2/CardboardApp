"use client";
import React from "react";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import StatisticBox from "./StatisticBox";
import UsageBar from "../../_components/UsageBar";

import type { FileListInterface } from "~/app/admin/_components/FileList";
import type { UserListInterface } from "~/app/admin/_components/UserList";
import type { PaymentListInterface } from "~/app/admin/_components/PaymentList";

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
    const tiers = {
      "tier-pleb": 0,
      "tier-normal": 0,
      "tier-whale": 0,
    };

    for (const currUser of props.AdminListProps) {
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
        <dl className="lg:grid-cols-0 mx-auto max-w-7xl grid-cols-1 bg-amber-100 px-2 py-5 shadow-md sm:grid-cols-5 md:grid xl:px-0">
          {Object.keys(adminStats).map((key) => (
            <StatisticBox
              key={key}
              title={key}
              statistic={adminStats[key as keyof AdminStatsInterface]}
            />
          ))}
        </dl>
      </div>
    </div>
  );
}

function FileList(props: {
  FileListProps: FileListInterface[];
  PaymentListProps: PaymentListInterface[];
  SelectedUser: UserListInterface;
}) {
  return (
    <div>
      <div>
        <div className="px-4 sm:px-6 lg:px-8 ">
          <div className="md: flex flex-col justify-between bg-amber-200 md:flex-row">
            <div className="flex-col">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <b className=" leading-6 text-gray-900">
                    User {props.SelectedUser.name} Files:
                  </b>
                </div>
              </div>
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
                statistic={Math.floor(
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
                <h1>File List</h1>
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

          <div></div>
          <div className="mt-5 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full overflow-hidden overflow-y-scroll py-2 align-middle sm:px-6 lg:px-8">
                <h1>Payments List</h1>
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Payment ID
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="float-right px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Tier
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 ">
                    {props.PaymentListProps?.map(
                      (payment: PaymentListInterface) => {
                        return (
                          <tr key={payment.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                              {payment.id}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {payment.status}
                            </td>
                            <td className="float-right whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {payment.tierId}
                            </td>
                          </tr>
                        );
                      },
                    )}
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
  const [userInfoView, setUserInfoView] = useState(false);
  const [userList, updateItems] = useState<Array<UserListInterface>>([]);
  const [fileList, updateFileList] = useState<Array<FileListInterface>>([]);
  const [paymentList, updatePaymentList] = useState<
    Array<PaymentListInterface>
  >([]);
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

  function getUserDetails(userId: string, user: UserListInterface) {
    requestUserFiles.mutate({ userId: userId });
    requestUserPayments.mutate({ userId: userId }); // This should be one call lmao but runnin out of tim eXDD
    setUserInfoView(true);
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

  const requestUserFiles = api.admin.getUserFiles.useMutation({
    onSuccess: (data) => {
      if (data !== undefined && data !== null) {
        console.log(data);
        updateFileList(data);
      }
    },
  });

  const requestUserPayments = api.admin.getUserPayments.useMutation({
    onSuccess: (data) => {
      if (data !== undefined && data !== null) {
        console.log(data);
        updatePaymentList(data);
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
    if (userInfoView == false) {
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
            <div className="mt-3 flow-root  pt-5 sm:px-5 md:px-10 lg:px-20">
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
                            <td className="whitespace py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                              {user.name}
                            </td>
                            <td className="whitespace px-3 py-4 text-sm text-gray-500">
                              {user.email}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {user.role}
                            </td>
                            <td className=" px-3 py-4 text-sm text-gray-500">
                              {user.tierId}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500">
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
                                onClick={() => getUserDetails(user.id, user)}
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
              onClick={() => setUserInfoView(false)}
            >
              Return to Users Page
            </button>
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className=" text-xl font-semibold leading-6 text-gray-900">
                  Admin Page | User Info
                </h1>
              </div>
            </div>
            <FileList
              FileListProps={fileList}
              PaymentListProps={paymentList}
              SelectedUser={selectedUser}
            />
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
