export default {
  routes: [
    {
      method: "PUT",
      path: "/posts/:documentId/like",
      handler: "api::post.post.likePost",
    },
  ],
};
