"use client";

import { STRAPI_API_URL } from "@/consts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { formatTimeAgo } from "../helpers";
import { StrapiApiResponse, StrapiPost, User } from "../types";

export default function Post({
  post: initialPost,
  jwt,
  currentUser,
}: {
  post: StrapiPost;
  jwt: string;
  currentUser: User;
}) {
  const queryClient = useQueryClient();

  // Get the latest post data from React Query cache
  const postsData = queryClient.getQueryData<StrapiApiResponse<StrapiPost>>([
    "posts",
  ]);

  // Find the current post in the cache data
  const post =
    postsData?.data.find((p) => p.documentId === initialPost.documentId) ||
    initialPost;

  const { mutate: likePost, isPending } = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await fetch(
        new URL(`/api/posts/${documentId}/like`, STRAPI_API_URL),
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Like failed");
      }

      return response.json();
    },
    onMutate: async (documentId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData<
        StrapiApiResponse<StrapiPost>
      >(["posts"]);

      // Optimistically update
      if (previousPosts) {
        queryClient.setQueryData<StrapiApiResponse<StrapiPost>>(
          ["posts"],
          (old) => {
            if (!old) return old;
            return {
              ...old,
              data: old.data.map((p) => {
                if (p.documentId === documentId) {
                  const isCurrentlyLiked = p.likedBy?.some(
                    (user) => user.documentId === currentUser?.documentId
                  );
                  return {
                    ...p,
                    likedBy: isCurrentlyLiked
                      ? p.likedBy?.filter(
                          (user) => user.documentId !== currentUser?.documentId
                        )
                      : [...(p.likedBy || []), currentUser],
                  };
                }
                return p;
              }),
            };
          }
        );
      }

      return { previousPosts };
    },
    onError: (err, documentId, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      console.error("Like error", err);
    },
    onSuccess: () => {
      // Refetch to get the latest data from server
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = () => {
    likePost(post.documentId);
  };

  const isLiked =
    post.likedBy?.some((user) => user.documentId === currentUser?.documentId) ||
    false;
  const likeCount = post.likedBy?.length || 0;

  return (
    <div className="flex flex-col border-b border-gray-200 mb-4 bg-white">
      {/* Header */}
      <div className="flex items-center p-3">
        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-yellow-400 to-pink-600 p-0.5">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-900">
              {post.author?.username?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
        </div>
        <span className="ml-3 text-sm font-semibold text-gray-900">
          {post.author?.username}
        </span>
      </div>

      {/* Image */}
      <div className="w-full aspect-square relative bg-gray-100">
        <Image
          src={STRAPI_API_URL + post.image.url}
          fill
          unoptimized
          alt={post.image.alternativeText || "Post image"}
          className="object-cover"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 px-3 py-2">
        <button
          onClick={handleLike}
          disabled={isPending}
          className="hover:text-gray-600 text-gray-900 disabled:opacity-50"
        >
          <svg
            className="w-6 h-6"
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
        <button className="hover:text-gray-600 text-gray-900">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
        <button className="hover:text-gray-600 text-gray-900">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
        <button className="ml-auto hover:text-gray-600 text-gray-900">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      </div>

      {/* Likes Count */}
      {likeCount > 0 && (
        <div className="px-3 pb-2">
          <p className="text-sm font-semibold text-gray-900">
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </p>
        </div>
      )}

      {/* Caption and Timestamp */}
      <div className="px-3 pb-3">
        <p className="text-sm text-gray-900">
          <span className="font-semibold mr-2">{post.author?.username}</span>
          {post.description}
        </p>
        <p className="text-xs text-gray-600 mt-1 uppercase">
          {formatTimeAgo(post.createdAt)} ago
        </p>
      </div>
    </div>
  );
}
