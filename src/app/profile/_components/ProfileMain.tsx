import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PromptBox from "./PromptBox";
import { Spinner } from "~/app/_components/Spinner";
import Image from "next/image";

type CallbackFunction = () => void;

export default function ProfileMain() {
  const router = useRouter();
  const user = api.user.getUser.useQuery();
  const [promptVisible, setPromptVisability] = useState(false);
  const [promptTitle, setPromptTitle] = useState("");
  const [promptMessage, setPromptMessage] = useState("");
  const [promptConfirmAction, setPromptConfirmAction] =
    useState<CallbackFunction>(function () {
      /**/
    });

  const deleteAccount = api.user.deleteAccount.useMutation({
    onSuccess: (data) => {
      router.push("/");
    },
  });

  function deleteUser() {
    deleteAccount.mutate();
  }

  const [newSubscription, setSubscription] = useState("");
  const [newSubscriptionExpiry, setSubscriptionExpiry] = useState<Date | null>(
    new Date(0),
  );

  const cancelSubscription = api.user.cancelSubscription.useMutation({
    onSuccess: (data) => {
      if (data) {
        setSubscription(data.tierId ?? "");
        setSubscriptionExpiry(data.tierExpiry);
      }
    },
  });

  function cancelSubscriptionConfirm() {
    cancelSubscription.mutate();
  }

  function showPrompt(
    title: string,
    message: string,
    confirmAction: CallbackFunction,
  ) {
    setPromptVisability(true);
    setPromptTitle(title);
    setPromptMessage(message);
    setPromptConfirmAction(confirmAction);
  }

  function hidePrompt() {
    setPromptVisability(false);
    setPromptTitle("");
    setPromptMessage("");
    setPromptConfirmAction(function () {
      /**/
    });
  }

  if (user.isLoading)
    return <div className="w-screen h-screen flex items-center justify-center"> <Spinner/> </div> 

  return (
    <>
      <div className="pt-20 lg:pt-10">
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col ">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-black/5">
            <div className="flex h-16 shrink-0 items-center"></div>
          </div>
        </div>
        <div className="lg:pl-72 ">
          <main>
            {promptVisible ? (
              <PromptBox
                title={promptTitle}
                message={promptMessage}
                confirmAction={promptConfirmAction}
                hidePrompt={hidePrompt}
              ></PromptBox>
            ) : (
              <></>
            )}
            <h1 className="px-10 text-2xl font-semibold leading-6 text-gray-900">
              Profile Page
            </h1>
            <div className=" divide-y divide-black/5 bg-amber-200">
              <div>
                <div className="mx-10 mt-8 grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 bg-amber-100 px-4 py-10 shadow-lg sm:px-6 md:grid-cols-3 lg:px-8 rounded-2xl">
                  <div>
                    <h2 className="text-base font-semibold leading-7 text-black">
                      Cardboard Information
                    </h2>
                    <p className="text-gray-00 mt-1 text-sm leading-6">
                      Your usage at Cardboard
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium leading-6 text-black">
                          Current Tier
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="tierId"
                            id="tierId"
                            value={
                              newSubscription == ""
                                ? user.data?.tierId ?? ""
                                : newSubscription
                            }
                            className="block w-full rounded-md border-0 bg-black/5 px-2 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                            disabled
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium leading-6 text-black">
                          Tier Expiry
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="tierExpiry"
                            id="tierExpiry"
                            value={
                              newSubscriptionExpiry?.toString() !==
                              new Date(0).toString()
                                ? ""
                                : user.data?.tierExpiry == null
                                ? ""
                                : user.data?.tierExpiry.toLocaleString()
                            }
                            className="block w-full rounded-md border-0 bg-black/5 px-2 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            disabled
                          />
                        </div>
                        {newSubscriptionExpiry == new Date(0)}
                      </div>
                    </div>

                    {user.data?.tierId !== "tier-pleb" &&
                    user.data?.tierId !== "" &&
                    newSubscription == "" ? (
                      <div className="mt-8">
                        <button
                          type="submit"
                          onClick={() =>
                            showPrompt(
                              "Cancel Subscription",
                              `Are you sure you want to cancel your subscription? You can cancel anytime before ${
                                user.data?.tierExpiry == null
                                  ? "your expiry date "
                                  : user.data?.tierExpiry.toLocaleString()
                              } or cancel now and lose all benefits.`,
                              function () {
                                return cancelSubscriptionConfirm;
                              },
                            )
                          }
                          className="rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-amber-400"
                        >
                          Cancel subscription
                        </button>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>

                <div className="mx-10 my-5 grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 bg-amber-100 px-4 py-10 shadow-lg sm:px-6 md:grid-cols-3 lg:px-8 rounded-2xl">
                  <div>
                    <h2 className="text-base font-semibold leading-7 text-black">
                      Personal Information
                    </h2>
                    <p className="text-gray-00 mt-1 text-sm leading-6">
                      Your information at Cardboard
                    </p>
                  </div>

                  <form className="md:col-span-2">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                      <div className="col-span-full flex items-center gap-x-8">
                        <Image
                                  className=" rounded-xl bg-gray-800 ring-2 ring-amber-700"
                                  src={user.data?.image ?? "/Cardboard_Normal.png"}
                                  alt=""
                                  height={96}
                                  width={96}
                              />
                      </div>

                      <div className="sm:col-span-full">
                        <label className="block text-sm font-medium leading-6 text-black">
                          Name
                        </label>
                        <div className="mt-2">
                          <input
                            disabled
                            type="text"
                            name="name"
                            id="name"
                            value={user.data?.name ?? ""}
                            className="block w-full rounded-md border-0 bg-black/5 px-2 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label className="block text-sm font-medium leading-6 text-black">
                          Email address
                        </label>
                        <div className="mt-2">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            disabled
                            value={user.data?.email ?? ""}
                            className="block w-full rounded-md border-0 bg-black/5 px-2 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="mx-3 grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
                  <div>
                    <h2 className="text-base font-semibold leading-7 text-black">
                      Delete account
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-800">
                      No longer want to use our service? You can delete your
                      account here. This action is not reversible. All
                      information related to this account will be deleted
                      permanently.
                    </p>
                  </div>

                  <div className="flex items-start md:col-span-2">
                    <button
                      onClick={() =>
                        showPrompt(
                          "Delete Account",
                          "Are you sure you want to delete your account? All of your data will be permanently removed from our servers forever. This action cannot be undone.",
                          function () {
                            return deleteUser;
                          },
                        )
                      }
                      className="rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-amber-400"
                    >
                      Yes, delete my account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
