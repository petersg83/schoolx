import router from '../koa-router';
import db from '../db';
import { authRequired } from '../utils/auth';

const knex = require('knex')({ client: 'pg' });

router.get('/schools', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  const count = await db.School.count();
  const schools = await db.School.findAll({
    offset: +ctx.query._start,
    limit: +ctx.query._end - ctx.query._start,
    order: [[ctx.query._sort, ctx.query._order]],
  });

  ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
  ctx.set('X-Total-Count', count);
  ctx.body = schools;
}));
