"use client";

import { STRAPI_API_URL } from "@/consts";
import { useMutation } from "@tanstack/react-query";
import { FormEvent } from "react";

export default function SignUpForm() {
  const { mutate } = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await fetch(
        new URL("/api/auth/local/register", STRAPI_API_URL),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: email,
            email: email,
            password: password,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Sign up failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Sign up successful", data);
    },
    onError: (error) => {
      console.error("Sign up error", error);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* Logo */}
        <div className="mb-12">
          <h1
            className="text-5xl font-semibold text-center"
            style={{ fontFamily: "cursive" }}
          >
            Strapigram
          </h1>
        </div>

        <p className="text-gray-500 text-center text-base font-semibold mb-6 px-8">
          Sign up to see photos and videos from your friends.
        </p>

        {/* Sign Up Form */}
        <form className="w-full space-y-3" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-400"
              placeholder="Email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-400"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-500 text-white text-sm font-semibold rounded-lg active:bg-blue-600 disabled:opacity-50"
          >
            Sign up
          </button>
        </form>
      </div>

      {/* Log In Link */}
      <div className="absolute bottom-8 w-full max-w-[400px] text-center border-t border-gray-300 pt-6">
        <p className="text-sm text-gray-600">
          Have an account?{" "}
          <a href="/sign-in" className="text-blue-500 font-semibold">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
