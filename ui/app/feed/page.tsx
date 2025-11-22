import { STRAPI_API_URL } from "@/consts";
import { redirect } from "next/navigation";
import qs from "qs";
import { StrapiApiResponse, StrapiPost } from "../types";
import { getJwtFromCookies, getUserFromCookies } from "../utils";
import FeedClient from "./FeedClient";

const getPosts = async (
  jwt: string
): Promise<StrapiApiResponse<StrapiPost>> => {
  const postsUrl = new URL("/api/posts", STRAPI_API_URL);
  const requestQueryParams = qs.stringify({
    sort: {
      createdAt: "desc",
    },
    populate: {
      image: true,
      author: true,
      likedBy: true,
    },
  });
  const latestPosts = await fetch([postsUrl, requestQueryParams].join("?"), {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  }).then((res) => res.json());

  return latestPosts;
};

const page = async () => {
  const jwt = await getJwtFromCookies();
  const user = await getUserFromCookies();

  if (!jwt || !user) {
    redirect("/sign-in");
  }

  const posts = await getPosts(jwt!);

  return <FeedClient initialPosts={posts} jwt={jwt} user={user} />;
};

export default page;
