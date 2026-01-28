/**
 * exchange router
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/exchange/calculate',
      handler: 'exchange.calculate',
    },
  ],
};
