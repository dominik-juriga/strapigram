"use client";

import { STRAPI_API_URL } from "@/consts";
import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UploadForm() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      description,
      imageFile,
    }: {
      description: string;
      imageFile: File;
    }) => {
      // Get JWT from cookie (client-side)
      const jwt = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwt="))
        ?.split("=")[1];

      if (!jwt) {
        throw new Error("Not authenticated");
      }

      // Get user from cookie
      const userCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user="))
        ?.split("=")[1];

      if (!userCookie) {
        throw new Error("User not found");
      }

      const user = JSON.parse(decodeURIComponent(userCookie));

      // Step 1: Upload image
      const formData = new FormData();
      formData.append("files", imageFile);

      const uploadResponse = await fetch(
        new URL("/api/upload", STRAPI_API_URL),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Image upload failed");
      }

      const uploadedFiles = await uploadResponse.json();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { documentId, ...image } = uploadedFiles[0];

      // Step 2: Create post with image reference
      const postResponse = await fetch(new URL("/api/posts", STRAPI_API_URL), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            description,
            image,
            author: user.documentId,
          },
        }),
      });

      if (!postResponse.ok) {
        throw new Error("Post creation failed");
      }

      return postResponse.json();
    },
    onSuccess: () => {
      router.push("/feed");
    },
    onError: (error) => {
      console.error("Upload error", error);
      alert("Failed to create post. Please try again.");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please select an image");
      return;
    }
    mutate({ description, imageFile });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-8 py-8">
      <div className="w-full max-w-[400px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-900 text-2xl"
          >
            ←
          </button>
          <h1 className="text-xl font-semibold text-gray-900">New Post</h1>
          <div className="w-6"></div>
        </div>

        {/* Form */}
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Photo
            </label>
            {imagePreview ? (
              <div className="w-full aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  fill
                  alt="Preview"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ) : (
              <label
                htmlFor="image"
                className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400"
              >
                <svg
                  className="w-12 h-12 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  Click to upload photo
                </span>
              </label>
            )}
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Caption
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-400"
              placeholder="Write a caption..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-blue-500 text-white text-sm font-semibold rounded-lg active:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Posting..." : "Share"}
          </button>
        </form>
      </div>
    </div>
  );
}
