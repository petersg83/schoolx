import router from '../koa-router';
import db from '../db';
import { authRequired } from '../utils/auth';

router.get('/emailsMetadata', authRequired(['admin'], async (ctx, next, { admin, superAdmin }) => {
  const membersIds = ctx.query.membersIds.split(',');
  if (admin) {
    ctx.body = await db.Member.getEmailsMetadata(membersIds, admin.schoolId);
  }
}));
