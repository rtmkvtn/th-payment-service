import Decimal from 'decimal.js';

const TIER_DIVISOR = new Decimal(10_000_000);

export default {
  async calculate(ctx) {
    const { amount } = ctx.request.body;

    // Validate input
    if (amount === undefined || amount === null) {
      return ctx.badRequest('Amount is required');
    }
    if (typeof amount !== 'number' || isNaN(amount)) {
      return ctx.badRequest('Amount must be a valid number');
    }

    const thb = new Decimal(amount);

    // 1. Find matching profit coefficient
    const profitCoeffs = await strapi.documents('api::profit-coeff.profit-coeff').findMany({
      filters: {
        amount_min: { $lte: thb.toNumber() },
        amount_max: { $gte: thb.toNumber() },
        is_active: true,
      },
      limit: 1,
    });

    if (!profitCoeffs || profitCoeffs.length === 0) {
      return ctx.badRequest('No matching coefficient found for this amount');
    }

    const coefficient = new Decimal(profitCoeffs[0].coefficient);

    // 2. Get RUB rate from rub_rate single type
    const rubRateRecord = await strapi.documents('api::rub-rate.rub-rate').findFirst({});
    if (!rubRateRecord || !rubRateRecord.rate) {
      return ctx.badRequest('RUB rate not configured');
    }
    const rubToUsdt = new Decimal(rubRateRecord.rate);

    // 3. Get USDT/THB rate from last rate record
    const rates = await strapi.documents('api::rate.rate').findMany({
      sort: { createdAt: 'desc' },
      limit: 1,
    });
    if (!rates || rates.length === 0) {
      return ctx.badRequest('USDT/THB rate not available');
    }
    const usdtToThb = new Decimal(rates[0].rate);

    // 4. Calculate exchange result using Decimal.js
    // margin = (coefficient * 100) / (thb / 10_000_000 + 1)
    const margin = coefficient.mul(100).div(thb.div(TIER_DIVISOR).plus(1));

    // Match Python's intermediate rounding
    const rubToThb = usdtToThb.div(rubToUsdt).toDecimalPlaces(3);
    const thbToRub = new Decimal(1).div(rubToThb).toDecimalPlaces(3);
    const rubRate = thbToRub.mul(margin).div(100).toDecimalPlaces(3);

    // rubAmount = thb * rubRate (rounded)
    const rubAmount = thb.mul(rubRate).round();

    // thbRate = usdtToThb * 100 / margin
    const thbRate = usdtToThb.mul(100).div(margin);

    return {
      data: {
        thbAmount: thb.toNumber(),
        rubRate: rubRate.toDecimalPlaces(3).toNumber(),
        rubAmount: rubAmount.toNumber(),
        thbRate: thbRate.toDecimalPlaces(2).toNumber(),
      },
    };
  },
};
