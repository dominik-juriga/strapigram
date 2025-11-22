export type User = {
  id: 1;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type StrapiPost = {
  id: number;
  documentId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  author: User;
  likedBy?: User[];
  image: {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: Record<
      "thumbnail" | "small" | "medium" | "large",
      {
        name: string;
        hash: string;
        ext: string;
        mime: string;
        path: string | null;
        width: number;
        height: number;
        size: number;
        sizeInBytes: number;
        url: string;
      }
    >;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
};
export type StrapiApiResponse<T> = {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};
