/**
 * post controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::post.post",
  ({ strapi }) => ({
    async likePost(ctx) {
      const { documentId } = ctx.params;
      const user = ctx.state.user;

      const currentPostStatus = await strapi
        .documents("api::post.post")
        .findOne({
          documentId,
          populate: ["likedBy"],
        });

      const likedByUsers = currentPostStatus.likedBy.map((u) => u.documentId);

      try {
        const updateResult = await strapi.documents("api::post.post").update({
          documentId,
          data: {
            likedBy: {
              [likedByUsers.includes(user.documentId)
                ? "disconnect"
                : "connect"]: [user.documentId],
            },
          },
          populate: ["likedBy"],
        });

        return this.sanitizeOutput(updateResult, ctx);
      } catch (error) {
        return ctx.badRequest("Unable to like the post", { error });
      }
    },
  })
);
