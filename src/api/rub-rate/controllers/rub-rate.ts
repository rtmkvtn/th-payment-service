/**
 * rub-rate controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::rub-rate.rub-rate', ({ strapi }) => ({
  async setRate(ctx) {
    const { rate } = ctx.request.body;

    if (rate === undefined || rate === null) {
      return ctx.badRequest('Rate is required');
    }

    if (typeof rate !== 'number' || isNaN(rate)) {
      return ctx.badRequest('Rate must be a valid number');
    }

    const existing = await strapi.documents('api::rub-rate.rub-rate').findFirst({});

    let result;
    if (existing) {
      result = await strapi.documents('api::rub-rate.rub-rate').update({
        documentId: existing.documentId,
        data: { rate },
      });
    } else {
      result = await strapi.documents('api::rub-rate.rub-rate').create({
        data: { rate },
      });
    }

    return { data: result };
  },
}));
