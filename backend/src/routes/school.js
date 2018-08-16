import router from '../koa-router';
import db from '../db';
import { authRequired } from '../utils/auth';

router.get('/schools', authRequired(['superAdmin'], async (ctx, next, { admin, superAdmin }) => {
  const count = await db.School.count();
  const schools = await db.School.findByCriteria({
    offset: +ctx.query._start,
    limit: +ctx.query._end - ctx.query._start,
    order: [[ctx.query._sort, ctx.query._order]],
  });

  ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
  ctx.set('X-Total-Count', count);
  ctx.body = schools;
}));

router.get('/schools/:id', authRequired(['superAdmin'], async (ctx, next, { admin, superAdmin }) => {
  ctx.body = await db.School.findById(ctx.params.id);
}));

router.put('/schools/:id', authRequired(['superAdmin'], async (ctx, next, { admin, superAdmin }) => {
  try {
    await db.School.update({
      name: ctx.request.body.name,
      urlName: ctx.request.body.urlName,
    }, {
      where: { id: ctx.params.id },
    });
    ctx.body = await db.School.findById(ctx.params.id);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      ctx.status = 409;
      ctx.body = { status: 409, message: 'A school with this urlName already exists.' };
    } else {
      ctx.status = 500;
      ctx.body = { status: 500, message: e.errors[0].message };
    }
  }
}));

router.post('/schools/', authRequired(['superAdmin'], async (ctx, next, { admin, superAdmin }) => {
  try {
    ctx.body = await db.School.create({
      name: ctx.request.body.name,
      urlName: ctx.request.body.urlName,
    });
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      ctx.status = 409;
      ctx.body = { status: 409, message: 'A school with this urlName already exists.' };
    } else {
      ctx.status = 500;
      ctx.body = { status: 500, message: e.errors[0].message };
    }
  }
}));

router.delete('/schools/:id', authRequired(['superAdmin'], async (ctx, next, { admin, superAdmin }) => {
  ctx.body = await db.School.findById(ctx.params.id);
  await db.School.destroy({ where: { id: ctx.params.id }});
}));
