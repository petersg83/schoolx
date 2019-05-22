import _ from 'lodash';
import moment from 'moment';
import fs from 'fs';
import download from 'download';
import router from '../koa-router';
import db from '../db';
import config from '../config';
import { sendMail } from '../utils/mail';

const stripe = require("stripe")(config.secretStripeApiKey);

router.post('/stripecheckoutsessioncompleted', async (ctx, next) => {
  const sig = ctx.request.headers["stripe-signature"];
  const stripeEvent = stripe.webhooks.constructEvent(ctx.request.rawBody, sig, config.secretStripeWHKey_stripecheckoutsessioncompleted);

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

router.post('/newInvoiceFinalized', async (ctx, next) => {
  const sig = ctx.request.headers["stripe-signature"];
  const stripeEvent = stripe.webhooks.constructEvent(ctx.request.rawBody, sig, config.secretStripeWHKey_newInvoiceFinalized);

  if (stripeEvent.type === 'invoice.finalized') {
    const clientEmail = stripeEvent.data.object.customer_email;

    try {
      await download(stripeEvent.data.object.invoice_pdf, 'tmp_invoices', { filename: `${stripeEvent.data.object.id}.pdf` });

      const mailOptions = {
        from: 'petersg83@gmail.com',
        to: clientEmail,
        subject: `[ClickIn] Votre facture du ${moment().format('DD-MM-YYYY')}`,
        html: `<p>Bonjour :)<br />
            Vous trouverez en pièce jointe la dernière facture en date concernant votre abonnement ClickIn !<br />
            <br />
            Je vous souhaite une excellente journée.<br />
            <br />
            Cordialement,<br />
            Pierre Noël
          </p>`,
        attachments: [{
          filename: 'facture_ClickIn.pdf',
          path: `./tmp_invoices/${stripeEvent.data.object.id}.pdf`,
        }],
      };
      await sendMail(mailOptions);
      fs.unlinkSync(`./tmp_invoices/${stripeEvent.data.object.id}.pdf`);
    } catch (e) {
      console.log(e);
      throw e;
    }
  } else {
    console.log('wrong stripe event', stripeEvent);
  }

  ctx.body = { received: true };
});
