import moment from 'moment';
import router from '../koa-router';
import db from '../db';


// TODO: sécuriser cet appel API
router.get('/inandout', async (ctx, next) => {
  try {
    const subdomain = ctx.request.header.origin.split('//')[1].split('.')[0];
    const schoolId = await db.School.getSchoolIdBySubdomain(subdomain);

    ctx.body = await db.Member.getTodaysInAndOutMembers(schoolId);
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.body = { status: 500, message: e.message };
  }
});

// TODO: Sécuriser cette appel API
router.get('/isSchoolOpenToday', async (ctx, next) => {
  const subdomain = ctx.request.header.origin.split('//')[1].split('.')[0];
  const schoolId = await db.School.getSchoolIdBySubdomain(subdomain);
  const isSchoolOpenToday = await db.School.isSchoolOpenOn(schoolId, moment().toISOString());
  ctx.body = {
    isSchoolOpenToday,
  };
});
