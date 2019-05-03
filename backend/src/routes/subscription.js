import moment from 'moment';
import router from '../koa-router';
import db from '../db';
import { authRequired } from '../utils/auth';
import config from '../config';

const stripe = require("stripe")(config.secretStripeApiKey);

router.get('/getSubscriptionInfo', authRequired(['admin'], async (ctx, next, { admin }) => {
  try {
    const school = await db.School.findById(admin.schoolId);
    let subscription = {};
    if (school.subscriptionId) {
      const sub = await stripe.subscriptions.retrieve(school.subscriptionId);
      if (sub) {
        subscription = {
          id: sub.id,
          planId: sub.items.data[0].plan.id,
          amount: sub.plan.amount,
          frequency: sub.plan.interval,
        };
      } else {
        throw new Error('subscription not found on stripe side', school.subscriptionId);
      }
    }

    ctx.body = {
      school,
      subscription,
    };
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.body = { status: 500, message: e.message };
  }
}));

router.post('/changeSubscription', authRequired(['admin'], async (ctx, next, { admin }) => {
  try {
    if (!ctx.request.body.newPlanId) {
      throw new Error('New plan missing');
    }

    const school = await db.School.findById(admin.schoolId);
    let subscription = {};

    if (!school.subscriptionId) {
      throw new Error('There is not actual subscription, so cannot change it to another one');
    }

    const sub = await stripe.subscriptions.retrieve(school.subscriptionId);

    if (!sub) {
      throw new Error('Subscription not found on stripe side', school.subscriptionId);
    }

    const actualPlanId = sub.items.data[0].plan.id;
    const currentItemId = sub.items.data[0].id;

    if (!actualPlanId || !currentItemId) {
      throw new Error(`There is no actual plan or currentItemId, so cannot change it to another one. planId: ${actualPlanId}, currentItemId: ${currentItemId}.`);
    }

    if (actualPlanId === ctx.request.body.newPlanId) {
      throw new Error('Cannot change to the same plan');
    }

    const updatedSubscription = await stripe.subscriptions.update(sub.id, {
      items: [{
        id: currentItemId,
        deleted: true,
      }, {
        plan: ctx.request.body.newPlanId,
        quantity: 1,
      }],
    });

    ctx.body = {
      id: sub.id,
      planId: sub.items.data[0].plan.id,
      amount: sub.plan.amount,
      frequency: sub.plan.interval,
    };
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.body = { status: 500, message: e.message };
  }
}));
