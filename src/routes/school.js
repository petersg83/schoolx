import router from '../koa-router';
import db from '../db';

router.get('/school/:id', async (ctx, next) => {
  ctx.body = await db.School.findById(ctx.params.id);
});
