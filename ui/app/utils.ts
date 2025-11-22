"use server";

import { cookies } from "next/headers";
import { User } from "./types";

export const setJwtCookie = async (
  jwt: string,
  user: Record<string, unknown>
) => {
  const cookieStore = await cookies();
  cookieStore.set("jwt", jwt, { path: "/" });
  cookieStore.set("user", JSON.stringify(user), { path: "/" });
};

export const getJwtFromCookies = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const jwtCookie = cookieStore.get("jwt");
  return jwtCookie ? jwtCookie.value : null;
};

export const getUserFromCookies = async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  if (userCookie) {
    try {
      return JSON.parse(userCookie.value);
    } catch {
      return null;
    }
  }
  return null;
};
