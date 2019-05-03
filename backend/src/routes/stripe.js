import _ from 'lodash';
import router from '../koa-router';
import db from '../db';
import config from '../config';

const stripe = require("stripe")(config.secretStripeApiKey);

router.post('/stripecheckoutsessioncompleted', async (ctx, next) => {
  const sig = ctx.request.headers["stripe-signature"];
  const stripeEvent = stripe.webhooks.constructEvent(ctx.request.rawBody, sig, config.secretStripeWHKey);

  if (stripeEvent.type === 'checkout.session.completed') {
    const school = await db.School.findById(stripeEvent.data.object.client_reference_id);

    if (!school) {
      console.log("hola école non trouvée, id cherché :", stripeEvent.data.object.client_reference_id);
    } else if (!school.subscriptionId || school.subscriptionId === stripeEvent.data.object.subscription) {
      await db.School.update({
        isFree: false,
        hasPaid: true,
        subscriptionId: stripeEvent.data.object.subscription,
        stripeClientIds: _.uniq([...school.stripeClientIds, stripeEvent.data.object.customer]),
      }, {
        where: { id: school.id },
      });
    } else {
      // TODO : m'envoyer un mail
      console.log('Apparemment on essaie de refaire un abonnement dans mon dos ?', school.subscriptionId, ' - ', stripeEvent.data.object.subscription);
    }
  } else {
    console.log('wrong stripe event', stripeEvent);
  }

  ctx.body = { received: true };
});
