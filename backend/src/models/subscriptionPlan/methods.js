import SubscriptionPlan from './index';

SubscriptionPlan.getAvailablePlans = async () => {
  const plans = await SubscriptionPlan.findAll({
    where: {
      available: true,
    },
  });

  return plans.sort((a, b) => {
    if (a.frequency === b.frequency) {
      return a.price < b.price ? 1 : -1;
    } else {
      return a.frequency > b.frequency ? 1 : -1;
    }
  });
};
