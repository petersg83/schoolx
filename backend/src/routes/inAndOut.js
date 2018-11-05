import router from '../koa-router';
import db from '../db';

router.get('/inandout', async (ctx, next) => {
  try {
    const subdomain = ctx.request.header.origin.split('//')[1].split('.')[0];
    const school = await db.School.findOne({ where: { urlName: subdomain } });

    ctx.body = await db.Member.getTodaysInAndOutMembers(school.id);
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.body = { status: 500, message: e.message };
  }
});
