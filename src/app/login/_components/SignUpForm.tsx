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
        <div className="mt-2 rounded-md ring-2 ring-inset ring-amber-700">
          <input
            {...signup("email")}
            type="input"
            disabled
            value="OUT OF ORDER"
            required
            className="block w-full border-0 bg-transparent p-2 text-sm leading-6 text-gray-900 shadow-sm duration-300 focus:outline-none"
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
        <div className="mt-2 rounded-md ring-2 ring-inset ring-amber-700">
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
            disabled
            value="OUT OF ORDER"
            className="block w-full border-0 bg-transparent p-2 text-sm leading-6 text-gray-900 shadow-sm duration-300 focus:outline-none"
          />
        </div>
      </div>
      <div>{signupError.password && <p>{signupError.password.message}</p>}</div>
      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-amber-400 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm duration-300 hover:bg-amber-500 active:opacity-80"
        >
          Sign up
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
