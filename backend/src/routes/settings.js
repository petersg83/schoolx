import router from '../koa-router';
import db from '../db';
import { authRequired } from '../utils/auth';

router.put('/settings', authRequired(['admin'], async (ctx, next, { admin }) => {
  if (ctx.request.body.accessCode || ctx.request.body.accessCode === '') {
    const t = await db.sequelize.transaction();
    try {
      const newAccessCode = ctx.request.body.accessCode;
      const school = await db.School.findById(admin.schoolId);
      if (school && newAccessCode !== school.accessCode) {
        await db.School.update({
          accessCode: newAccessCode,
        }, {
          where: { id: admin.schoolId },
          transaction: t,
        });
        await db.School.setAndgetNewJWT(admin.schoolId, t);
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
  };
}));
