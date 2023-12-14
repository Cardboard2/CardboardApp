import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Landing() {
  const router = useRouter();
  const session = useSession();

  return (
    // <div className="grid w-full grid-cols-5 bg-amber-500">
    //   <div className="w-full px-20 py-20"></div>
    // </div>

    <div className={`flex w-full justify-center`}>
      <div
        className={`gap-x-30 md:py-30 mt-20 w-[80%] rounded-lg bg-amber-100 text-center shadow-md lg:grid lg:grid-cols-5 lg:py-32 `}
      >
        <div className="col-span-5 mx-5 my-5 flex flex-col gap-6 lg:col-span-2 lg:pl-16 lg:pr-0">
          <h1 className="text-3xl font-medium md:text-6xl">
            Welcome to Cardboard.
          </h1>
          <h2 className="text-xl">
            Pack and store your digital world effortlessly. View, share and
            manage your files, just like a neatly packed cardboard box but on
            the cloud.
          </h2>
          <div className="mx-auto flex gap-3">
            <button
              onClick={() => router.push("/pricing")}
              className="rounded-lg border-[1px] border-black/10 bg-amber-500 px-3 py-2 text-xl font-medium text-black hover:bg-amber-400"
            >
              See Pricings
            </button>

            {session.status == "authenticated" ? (
              <button
                onClick={() => router.push("/dashboard")}
                className="rounded-lg border-[1px] border-black/10 px-3 py-2 text-xl font-medium  hover:bg-amber-200"
              >
                Go to Dashboard
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="rounded-lg border-[1px] border-black/10 px-3 py-2 text-xl font-medium  hover:bg-amber-200"
              >
                Sign in
              </button>
            )}
          </div>

          {session.status == "authenticated" ? (
            <></>
          ) : (
            <p className="mt-5">
              New user to Cardbox?{" "}
              <a href="/login" className="pl-4 text-amber-600">
                Sign up here
              </a>
            </p>
          )}
        </div>
        <div className="block lg:col-span-3">
          <Image
            src="/boxman.png"
            alt="Cardboard page main"
            width={550}
            height={400}
            style={{ objectFit: "contain" }}
            className="mx-auto h-[100px] lg:float-none  lg:mx-auto lg:mt-[-20px] lg:h-full lg:pl-10"
          ></Image>
        </div>
      </div>
    </div>
  );
}
