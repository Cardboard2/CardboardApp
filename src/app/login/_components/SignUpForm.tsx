import { useForm, SubmitHandler } from "react-hook-form";
import React from "react";

interface IFormInput {
  email: string;
  password: string;
}

const SignUpForm = () => {
  const {
    register: signup,
    formState: { errors: signupError },
    handleSubmit: handleSignup,
  } = useForm<IFormInput>();

  const submitSignup: SubmitHandler<IFormInput> = (data) => console.log(data);

  return (
    <form className="space-y-6" onSubmit={handleSignup(submitSignup)}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Email address
        </label>
        <div className="mt-2 ring-2 ring-inset ring-amber-700 rounded-md">
          <input
            {...signup("email")}
            type="input"
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
            {...signup("password", {
              required: "You must specify a password",
              minLength: {
                value: 8,
                message: "Password must have at least 8 characters",
              },
            })}
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="block w-full border-0 p-2 text-gray-900 shadow-sm bg-transparent focus:outline-none duration-300 text-sm leading-6"
          />
        </div>
      </div>
      <div>{signupError.password && <p>{signupError.password.message}</p>}</div>
      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-amber-400 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-amber-500 active:opacity-80 duration-300"
        >
          Sign up
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;