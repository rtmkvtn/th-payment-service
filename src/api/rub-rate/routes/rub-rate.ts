/**
 * rub-rate router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/rub-rate',
      handler: 'rub-rate.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/rub-rate',
      handler: 'rub-rate.update',
      config: {
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/rub-rate',
      handler: 'rub-rate.delete',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/rub-rate/set-rate',
      handler: 'rub-rate.setRate',
      config: {
        policies: [],
      },
    },
  ],
};
