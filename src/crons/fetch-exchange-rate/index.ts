import type { Core } from '@strapi/strapi';
import { fetchUsdtThbRate } from '../../api/rate/services/rate-fetcher';

export default {
  task: async ({ strapi }: { strapi: Core.Strapi }) => {
    try {
      const rate = await fetchUsdtThbRate();
      await strapi.documents('api::rate.rate').create({
        data: { rate },
      });
      strapi.log.info(`Exchange rate fetched and saved: ${rate} THB/USDT`);
    } catch (error) {
      strapi.log.error('Failed to fetch exchange rate:', error);
    }
  },
  options: {
    rule: '*/5 * * * *',
  },
};
