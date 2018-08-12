import router from '../koa-router';
import db from '../db';

router.post('/login', async (ctx, next) => {
  const params = ctx.request.body;
  let jwt;
  let status = 200;

  if (params.subdomain === 'superadmin') {
    // TODO: superadmin connection
  } else {
    const admin = await db.Admin.authenticate({
      email: params.email,
      password: params.password,
      schoolUrl: params.subdomain,
    });
    if (admin && !admin.jwt) {
      const jwt = await db.Admin.setAndgetNewJWT({ adminId: admin.id, email: params.email, schoolUrl: params.subdomain });
      ctx.body = { jwt };
    } else if (admin) {
      ctx.body = { jwt: admin.jwt };
    } else {
      ctx.status = 403;
    }
  }
});
