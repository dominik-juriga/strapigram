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

      try {
        const result = await strapi
          .service("api::post.post")
          .likePost(documentId, user.documentId);

        return this.sanitizeOutput(result, ctx);
      } catch (error) {
        return ctx.badRequest("Unable to like the post", { error });
      }
    },
  })
);
