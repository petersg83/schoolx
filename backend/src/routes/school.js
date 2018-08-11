import router from '../koa-router';
import db from '../db';

const knex = require('knex')({ client: 'pg' });

router.get('/schools', async (ctx, next) => {
  const queryString = knex('school')
    .offset(+ctx.query._start)
    .limit(+ctx.query._end - ctx.query._start)
    .orderBy(ctx.query._sort, ctx.query._order)
    .toString()
    .concat(';');

  const count = await db.School.count();
  const response = await db.sequelize.query(queryString);

  ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
  ctx.set('X-Total-Count', count);
  ctx.body = response[0];
});
