import router from '../koa-router';
import db from '../db';
import { authRequired } from '../utils/auth';
import { periodsOverlap } from '../utils/dates';

// READ MANY
router.get('/members', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  if (admin) {
    const count = await db.Member.count({ where: { schoolId: admin.schoolId } });
    const members = await db.Member.findAll({
      where: { schoolId: admin.schoolId },
      offset: +ctx.query._start,
      limit: +ctx.query._end - ctx.query._start,
      order: [[ctx.query._sort, ctx.query._order]],
    });

    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', count);
    ctx.body = members;
  } else if (superAdmin) {
    const count = await db.Member.count();
    const members = await db.Member.findAll({
      offset: +ctx.query._start,
      limit: +ctx.query._end - ctx.query._start,
      order: [[ctx.query._sort, ctx.query._order]],
    });

    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', count);
    ctx.body = members;
  }
}));

// READ ONE
router.get('/members/:id', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  if (admin) {
    ctx.body = await db.Member.findByIdAndSchoolId(ctx.params.id, admin.schoolId);
  } else if (superAdmin) {
    ctx.body = await db.Member.findById(ctx.params.id);
  }
}));

// EDIT
router.put('/members/:id', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  const t = await db.sequelize.transaction();

  try {
    if (periodsOverlap(ctx.request.body.memberSettings) || periodsOverlap(ctx.request.body.memberPeriodsAtSchool)) {
      throw new Error('Overlap');
    }
    if (admin) {
      await admin.canEditMembers([ctx.params.id]);
    } else if (!superAdmin) {
      throw new Error('Auth error');
    }

    // member
    await db.Member.update({
      firstName: ctx.request.body.firstName,
      lastName: ctx.request.body.lastName,
      birthday: ctx.request.body.birthday
    }, {
      where: { id: ctx.params.id },
      transaction: t,
    });

    // memberSettings
    const existingMemberSettings = await db.MemberSettings.findMemberSettingsForMember(ctx.params.id);
    const memberSettingsToAdd = ctx.request.body.memberSettings.filter(ms => !ms.id);
    memberSettingsToAdd.forEach((ms) => { ms.memberId = ctx.params.id; });
    const memberSettingsToUpdate = ctx.request.body.memberSettings.filter(ms => !!ms.id);
    const memberSettingsIdsToDelete = existingMemberSettings.filter(ems => !ctx.request.body.memberSettings.some(ms => ms.id === ems.id)).map(ms => ms.id);
    await db.MemberSettings.destroy({ where: { id: { $in: memberSettingsIdsToDelete } }, transaction: t });
    for (const ms of memberSettingsToUpdate) {
      await db.MemberSettings.update({
        daysOff: ms.daysOff || [],
        startAt: ms.startAt,
        endAt: ms.endAt || null,
      }, {
        where: { id: ms.id, memberId: ctx.params.id },
        transaction: t,
      });
    }
    await db.MemberSettings.bulkCreate(memberSettingsToAdd, { transaction: t });

    // memberPeriodsAtSchool
    await db.MemberPeriodsAtSchool.destroy({
      where: { memberId: ctx.params.id },
      transaction: t,
    });
    const memberPeriodsAtSchoolToAdd = ctx.request.body.memberPeriodsAtSchool.map(mp => ({ ...mp, memberId: ctx.params.id }));

    await db.MemberPeriodsAtSchool.bulkCreate(memberPeriodsAtSchoolToAdd, { transaction: t });

    await t.commit();
    ctx.body = await db.Member.findById(ctx.params.id);
  } catch (e) {
    console.log(`Can't edit member ${ctx.params.id} :` , e);
    await t.rollback();
    if (e.message === 'Overlap') {
      ctx.status = 409;
      ctx.body = { status: 409, message: 'Les périodes entrées (jours off ou périodes d\'inscription) ne doivent pas se superposer' };
    } else if (e.message === 'Auth error') {
      ctx.status = 403;
      ctx.body = { status: 403, message: 'You are neither an admin or a superAdmin. You can\'t perform this action' };
    } else {
      ctx.status = 500;
    }
  }
}));

// CREATE
router.post('/members/', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  if (admin) {
    ctx.body = await db.Member.createWithSettingsAndPeriods({
      firstName: ctx.request.body.firstName,
      lastName: ctx.request.body.lastName,
      birthday: ctx.request.body.birthday,
      schoolId: admin.schoolId,
      daysOff: ctx.request.body.daysOff,
      arrivalDate: ctx.request.body.arrivalDate,
    });
  } else if (superAdmin) {
    console.log('Feature not available yet'); // TODO
  }
}));

// DELETE
router.delete('/members/:id', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  if (admin) {
    ctx.body = await db.Member.findByIdAndSchoolId(ctx.params.id, admin.schoolId);
    await db.Member.destroy({ where: { id: ctx.params.id, schoolId: admin.schoolId }});
  } else if (superAdmin) {
    ctx.body = await db.Member.findById(ctx.params.id);
    await db.Member.destroy({ where: { id: ctx.params.id }});
  }
}));
