import moment from 'moment';
import _ from 'lodash';
import pMap from 'p-map';
import SMSAPI from 'smsapicom';
import nodemailer from 'nodemailer';
import router from '../koa-router';
import db from '../db';
import { authRequired } from '../utils/auth';
import { sendMail } from '../utils/mail';

const formatPhoneNumber = (phoneNumber = '') => {
  let newPhoneNumber = phoneNumber.replace(/\./g, '');
  newPhoneNumber = newPhoneNumber.replace(/ /g, '');
  if (newPhoneNumber.startsWith('06') || newPhoneNumber.startsWith('07')) {
    newPhoneNumber = newPhoneNumber.slice(1);
    newPhoneNumber = `33${newPhoneNumber}`;
  } else if (newPhoneNumber.startsWith('+33')) {
    newPhoneNumber = newPhoneNumber.slice(1);
  } else if (newPhoneNumber.startsWith('0033')) {
    newPhoneNumber = newPhoneNumber.slice(2);
  }

  return newPhoneNumber;
};

// Remplace les variables <%=nom%> des modèles saisis par les admins.
// Volontairement limité à une substitution : les modèles ne doivent jamais être
// exécutés (lodash _.template exécute le JavaScript contenu dans <% %>).
// Une variable inconnue est laissée telle quelle.
const TEMPLATE_VARIABLE = /<%[=-]?\s*(\w+)\s*%>/g;
const fillTemplate = (template, data, { escapeHtml = false } = {}) => template.replace(
  TEMPLATE_VARIABLE,
  (match, name) => {
    if (!Object.prototype.hasOwnProperty.call(data, name)) {
      return match;
    }
    const value = String(data[name] == null ? '' : data[name]);
    return escapeHtml ? _.escape(value) : value;
  },
);

router.get('/emailsMetadata', authRequired(['admin'], async (ctx, next, { admin, superAdmin }) => {
  const membersIds = ctx.query.membersIds.split(',');
  if (admin) {
    ctx.body = await db.Member.getEmailsMetadata(membersIds, admin.schoolId);
  }
}));

router.post('/sendEmailsAndSms', authRequired(['admin'], async (ctx, next, { admin }) => {
  const metadata = ctx.request.body.metadata || [];
  const emailsToSend = metadata.filter(m => m.sendingType === 'email');
  const smsToSend = metadata.filter(m => m.sendingType === 'sms');
  const emailSubject = ctx.request.body.emailSubject || '';
  const emailContent = ctx.request.body.emailContent || '';
  const smsContent = ctx.request.body.smsContent || '';
  const emailAddressesError = [];
  const phoneNumbersError = [];

  const school = await db.School.findById(admin.schoolId);

  if (emailsToSend.length) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
       user: school.emailAddress,
       pass: school.emailToken,
     }
    });

    const createEmailPromise = async m => {
      const data = {
        memberName: m.memberName,
        receiverName: m.name,
        date: moment().format('DD/MM/yyyy'),
      };

      try {
        await transporter.sendMail({
          to: m.emailAddress,
          from: school.emailAddress,
          subject: fillTemplate(emailSubject, data),
          html: fillTemplate(emailContent, data, { escapeHtml: true }),
          text: fillTemplate(emailContent, data),
        });
      } catch (e) {
        console.error('m.emailAddress' + e);
        emailAddressesError.push(m.emailAddress);
      }
    };
    await pMap(emailsToSend, createEmailPromise, { concurrency: 10, stopOnError: false });
  }

  if (smsToSend.length) {
    const smsapi = new SMSAPI({ oauth: { accessToken: school.smsToken } });

    const createSmsPromise = async m => {
      const data = {
        memberName: m.memberName,
        receiverName: m.name,
        date: moment().format('DD/MM/yyyy'),
      };

      try {
        await smsapi.message
          .sms()
          .from(_.toUpper(_.camelCase(school.urlName)))
          .to(formatPhoneNumber(m.phoneNumber))
          .message(fillTemplate(smsContent, data))
          .execute();
      } catch (e) {
        phoneNumbersError.push(m.phoneNumber);
      }
    };

    const res = await pMap(smsToSend, createSmsPromise, { concurrency: 10, stopOnError: false });
  }

  if (emailAddressesError.length > 0 || phoneNumbersError.length > 0) {
    ctx.body = {
      error: `Certains emails/sms n'ont pas pu être envoyés pour : ${emailAddressesError.concat(phoneNumbersError).join(', ')}.`,
    };
    return;
  }

  ctx.body = { ok: true };
}));
