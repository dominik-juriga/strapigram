"use client";

import { useQuery } from "@tanstack/react-query";
import { StrapiApiResponse, StrapiPost, User } from "../types";
import Post from "./Post";
import { STRAPI_API_URL } from "@/consts";
import qs from "qs";

async function fetchPosts(jwt: string): Promise<StrapiApiResponse<StrapiPost>> {
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
  const response = await fetch([postsUrl, requestQueryParams].join("?"), {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
}

export default function FeedClient({
  initialPosts,
  jwt,
  user,
}: {
  initialPosts: StrapiApiResponse<StrapiPost>;
  jwt: string;
  user: User;
}) {
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts(jwt),
    initialData: initialPosts,
    staleTime: 0, // Consider data stale immediately so mutations trigger refetch
  });

  return (
    <div className="max-w-[500px] mx-auto">
      {posts.data.map((post) => (
        <Post key={post.id} post={post} jwt={jwt} currentUser={user} />
      ))}
    </div>
  );
}
