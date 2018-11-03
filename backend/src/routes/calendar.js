import router from '../koa-router';
import db from '../db';
import { authRequired } from '../utils/auth';
import moment from 'moment';

router.get('/schoolEvents', authRequired(['admin'], async (ctx, next, { admin, superAdmin }) => {
  if (ctx.query.currentDay) {
    const fromDate = moment(+ctx.query.currentDay).startOf('month').subtract(2, 'months');
    const toDate = moment(+ctx.query.currentDay).endOf('month').add(2, 'months');

    const schoolYears = await db.SchoolYear.findAll({
      where: {
        schoolId: admin.schoolId,
      },
      include: [{
        model: db.SchoolYearSettings,
        as: 'schoolYearSettings',
        where: {
          startAt: { $lte: toDate.toISOString() },
          $or: [{
            endAt: null,
          }, {
            endAt: { $gte: fromDate.toISOString() },
          }],
        },
        include: [{ model: db.UsualOpenedDays, as: 'usualOpenedDays' }],
      }],
    });

    const specialSchoolDays = await db.SpecialSchoolDay.findAll({
      where: {
        schoolId: admin.schoolId,
        day: { $between: [fromDate.toISOString(), toDate.toISOString()] },
      },
    });

    ctx.body = {
      schoolYears,
      specialSchoolDays,
    };
  }
}));

router.post('/specialSchoolDay', authRequired(['admin'], async (ctx, next, { admin, superAdmin }) => {
  const day = moment(ctx.request.body.day).startOf('day');

  const alreadyExist = await db.SpecialSchoolDay.findOne({
    where: {
      schoolId: admin.schoolId,
      day,
    },
  });

  if (!alreadyExist) {
    ctx.body = await db.SpecialSchoolDay.create({
      schoolId: admin.schoolId,
      isClosed: ctx.request.body.isClosed,
      day,
      openAt: ctx.request.body.isClosed ? null : ctx.request.body.openAt,
      closeAt: ctx.request.body.isClosed ? null : ctx.request.body.closeAt,
      maxArrivalTime: ctx.request.body.isClosed ? null : ctx.request.body.maxArrivalTime,
      minTimeBefPartialAbsence: ctx.request.body.isClosed ? null : ctx.request.body.minTimeBefPartialAbsence,
      minTimeBefTotalAbsence: ctx.request.body.isClosed ? null : ctx.request.body.minTimeBefTotalAbsence,
      note: ctx.request.body.note,
    });
  } else {
    ctx.status = 409;
    ctx.body = { status: 409, message: 'Ce jour est déjà spécial' };
  }
}));
