/**
 * post service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::post.post", ({ strapi }) => ({
  async likePost(documentId, userDocumentId) {
    const currentPostStatus = await strapi.documents("api::post.post").findOne({
      documentId,
      populate: ["likedBy"],
    });

    const likedByUsers = currentPostStatus.likedBy.map((u) => u.documentId);

    const updateResult = await strapi.documents("api::post.post").update({
      documentId,
      data: {
        likedBy: {
          [likedByUsers.includes(userDocumentId) ? "disconnect" : "connect"]: [
            userDocumentId,
          ],
        },
      },
      populate: ["likedBy"],
    });

    return updateResult;
  },
}));
