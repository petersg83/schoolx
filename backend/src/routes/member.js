import router from '../koa-router';
import db from '../db';
import { authRequired } from '../utils/auth';

router.get('/members', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  if (admin) {
    const count = await db.Member.count({ where: { schoolId: admin.schoolId } });
    const members = await db.Member.findAll({
      where: { schoolId: admin.schoolId },
      offset: +ctx.query._start,
      limit: +ctx.query._end - ctx.query._start,
      order: [[ctx.query._sort, ctx.query._order]],
    });

    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', count);
    ctx.body = members;
  } else if (superAdmin) {
    const count = await db.Member.count();
    const members = await db.Member.findAll({
      offset: +ctx.query._start,
      limit: +ctx.query._end - ctx.query._start,
      order: [[ctx.query._sort, ctx.query._order]],
    });

    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', count);
    ctx.body = members;
  }
}));

router.get('/members/:id', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  if (admin) {
    ctx.body = await db.Member.findByIdAndSchoolId(ctx.params.id, admin.schoolId);
  } else if (superAdmin) {
    ctx.body = await db.Member.findById(ctx.params.id);
  }
}));

router.put('/members/:id', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  if (admin) {
    await db.Member.update({
      firstName: ctx.request.body.firstName,
      lastName: ctx.request.body.lastName,
      birthday: ctx.request.body.birthday,
    }, {
      where: {
        id: ctx.params.id,
        schoolId: admin.schoolId,
      },
    });
    ctx.body = await db.Member.findByIdAndSchoolId(ctx.params.id, admin.schoolId);
  } else if (superAdmin) {
    await db.Member.update({
      firstName: ctx.request.body.firstName,
      lastName: ctx.request.body.lastName,
      birthday: ctx.request.body.birthday,
    }, {
      where: {
        id: ctx.params.id,
      },
    });
    ctx.body = await db.Member.findById(ctx.params.id);
  }
}));

router.post('/members/', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  if (admin) {
      ctx.body = await db.Member.create({
        firstName: ctx.request.body.firstName,
        lastName: ctx.request.body.lastName,
        birthday: ctx.request.body.birthday,
        schoolId: admin.schoolId,
      });
  } else if (superAdmin) {
    console.log('Feature not available yet'); // TODO
  }
}));

router.delete('/members/:id', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  if (admin) {
    ctx.body = await db.Member.findByIdAndSchoolId(ctx.params.id, admin.schoolId);
    await db.Member.destroy({ where: { id: ctx.params.id, schoolId: admin.schoolId }});
  } else if (superAdmin) {
    ctx.body = await db.Member.findById(ctx.params.id);
    await db.Member.destroy({ where: { id: ctx.params.id }});
  }
}));
