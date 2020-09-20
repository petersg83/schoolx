import _ from 'lodash';
import router from '../koa-router';
import db from '../db';
import { authRequired } from '../utils/auth';

router.put('/settings', authRequired(['admin'], async (ctx, next, { admin }) => {
  const updates = _.pick(ctx.request.body, ['accessCode', 'email', 'emailSubject', 'sms']);
  if (updates.accessCode) {
    const t = await db.sequelize.transaction();
    try {
      const school = await db.School.findById(admin.schoolId);
      if (school) {
        await db.School.update(updates, {
          where: { id: admin.schoolId },
          transaction: t,
        });
        if (updates.accessCode !== school.accessCode) {
          await db.School.setAndgetNewJWT(admin.schoolId, t);
        }
      }
      await t.commit();
      ctx.body = await db.School.findById(admin.schoolId);
    } catch (e) {
      console.log('e', e);
      await t.rollback();
      throw e;
    }
  } else {
    ctx.status = 401;
    ctx.body = { status: 401, message: "l'access code est manquant" };
  }
}));

router.get('/settings', authRequired(['admin'], async (ctx, next, { admin }) => {
  const school = await db.School.findById(admin.schoolId);
  ctx.body = {
    accessCode: school.accessCode,
    sms: school.sms,
    email: school.email,
    emailSubject: school.emailSubject,
  };
}));
