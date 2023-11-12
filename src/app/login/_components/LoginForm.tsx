import { useForm, SubmitHandler } from "react-hook-form";
import React from "react";
import { signIn } from "next-auth/react";

interface IFormInput {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [error, setError] = React.useState("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const submitForm: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);

    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl: `${window.location.origin}`,
    });

    console.log(res);
    if (res?.error) {
      setError(res.error);
    } else {
      setError("");
    }
    // if (res.url) router.push(res.url);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(submitForm)}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Email address
        </label>
        <div className="mt-2 ring-2 ring-inset ring-amber-700 rounded-md">
          <input
            {...register("email")}
            type="text"
            required
            className="block w-full border-0 p-2 text-gray-900 shadow-sm bg-transparent focus:outline-none duration-300 text-sm leading-6"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Password
        </label>
        <div className="mt-2 ring-2 ring-inset ring-amber-700 rounded-md">
          <input
            {...register("password")}
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="block w-full border-0 p-2 text-gray-900 shadow-sm bg-transparent focus:outline-none duration-300 text-sm leading-6"
          />
        </div>
        {error}
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-amber-700 focus:ring-amber-800 accent-amber-600"
          />
          <label
            htmlFor="remember-me"
            className="ml-3 block text-sm leading-6 text-gray-900"
          >
            Remember me
          </label>
        </div>

        <div className="text-sm leading-6">
          <a
            href="#"
            className="font-semibold text-amber-700 hover:text-amber-800 duration-300"
          >
            Forgot password?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-amber-400 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-amber-500 active:opacity-80 duration-300"
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
