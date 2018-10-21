import router from '../koa-router';
import db from '../db';

router.post('/login', async (ctx, next) => {
  const params = ctx.request.body;
  let jwt;
  let status = 200;

  if (params.subdomain === 'superadmin') {
    const superAdmin = await db.SuperAdmin.authenticate({
      email: params.email,
      password: params.password,
    });
    if (superAdmin && !superAdmin.jwt) {
      const jwt = await db.SuperAdmin.setAndgetNewJWT({ superAdminId: superAdmin.id, email: params.email });
      ctx.body = { jwt };
    } else if (superAdmin) {
      ctx.body = { jwt: superAdmin.jwt };
    } else {
      ctx.status = 403;
    }
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
