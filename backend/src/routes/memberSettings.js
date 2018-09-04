import router from '../koa-router';
import db from '../db';
import { authRequired } from '../utils/auth';

// READ MANY
router.get('/memberSettings', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  if (admin) {
    const count = await db.MemberSettings.count({
      where: { memberId: ctx.query.memberId },
      include: [{ model: db.Member, as: 'member', where: { schoolId: admin.schoolId }}],
    });
    const memberSettings = await db.MemberSettings.findAll({
      where: { memberId: ctx.query.memberId },
      offset: +ctx.query._start,
      limit: +ctx.query._end - ctx.query._start,
      order: [[ctx.query._sort, ctx.query._order]],
      include: [{ model: db.Member, as: 'member', where: { schoolId: admin.schoolId }}],
    });

    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', count);
    ctx.body = memberSettings;
  } else if (superAdmin) {
    const count = await db.MemberSettings.count();
    const memberSettings = await db.MemberSettings.findAll({
      where: { memberId: ctx.query.memberId },
      offset: +ctx.query._start,
      limit: +ctx.query._end - ctx.query._start,
      order: [[ctx.query._sort, ctx.query._order]],
    });

    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', count);
    ctx.body = memberSettings;
  }
}));
