import moment from 'moment';
import router from '../koa-router';
import db from '../db';
import { authRequired } from '../utils/auth';
import { periodsOverlap } from '../utils/dates';

router.get('/schoolYears', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  if (admin) {
    const count = await db.SchoolYear.count({ where: { schoolId: admin.schoolId } });
    const schoolYears = await db.SchoolYear.findAll({
      where: { schoolId: admin.schoolId },
      offset: +ctx.query._start,
      limit: +ctx.query._end - ctx.query._start,
      order: [[ctx.query._sort, ctx.query._order]],
    });

    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', count);
    ctx.body = schoolYears;
  } else if (superAdmin) {
    const count = await db.SchoolYear.count();
    const schoolYears = await db.SchoolYear.findAll({
      offset: +ctx.query._start,
      limit: +ctx.query._end - ctx.query._start,
      order: [[ctx.query._sort, ctx.query._order]],
    });

    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', count);
    ctx.body = schoolYears;
  }
}));


// READ ONE
router.get('/schoolYears/:id', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  if (admin) {
    ctx.body = await db.SchoolYear.findByIdAndSchoolId(ctx.params.id, admin.schoolId);
  } else if (superAdmin) {
    ctx.body = await db.SchoolYear.findById(ctx.params.id);
  }
}));

// EDIT
router.put('/schoolYears/:id', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  const t = await db.sequelize.transaction();

  const yearsAlreadyExisting =  await db.SchoolYear.findAllBySchoolId(admin.schoolId);
  const newYear = {
    startAt: moment(ctx.request.body.startAt).startOf('day').toDate(),
    endAt: ctx.request.body.endAt ? moment(ctx.request.body.endAt).startOf('day').toDate() : null,
    schoolId: admin.schoolId,
    nbOfDaysOfHolidays: ctx.request.body.nbOfDaysOfHolidays,
  };
  const newYears = yearsAlreadyExisting.map(y => y.id !== ctx.params.id ? y : newYear);

  try {
    if (periodsOverlap(newYears)) {
      throw new Error('Overlap');
    }
    if (admin) {
      await admin.canEditSchoolYears([ctx.params.id]);
    } else if (!superAdmin) {
      throw new Error('Auth error');
    }
    await db.SchoolYear.update(newYear, { where: { id: ctx.params.id }, transaction: t });
    await db.SchoolYearSettings.destroy({ where: { schoolYearId: ctx.params.id }, transaction: t });

    for (let nss of ctx.request.body.schoolYearSettings) {
      if (nss.usualOpenedDays.length) {
        const createdSchoolYearSettings = await db.SchoolYearSettings.create({
          schoolYearId: ctx.params.id,
          startAt: moment(nss.startAt).startOf('day').toDate(),
          endAt: nss.endAt ? moment(nss.endAt).startOf('day').toDate() : null,
        }, {
          transaction: t,
        });
        const usualOpenedDaysForThisNss = nss.usualOpenedDays.map(uod => ({ ...uod, schoolYearSettingsId: createdSchoolYearSettings.id }));
        await db.UsualOpenedDays.bulkCreate(usualOpenedDaysForThisNss, { transaction: t });
      }
    }

    await t.commit();
    ctx.body = await db.SchoolYear.findById(ctx.params.id);
  } catch (e) {
    console.log(`Can't edit schoolYear ${ctx.params.id} :` , e);
    await t.rollback();
    if (e.message === 'Overlap') {
      ctx.status = 409;
      ctx.body = { status: 409, message: 'Les années entrées ne doivent pas se superposer' };
    } else if (e.message === 'Auth error') {
      ctx.status = 403;
      ctx.body = { status: 403, message: 'You are neither an admin or a superAdmin. You can\'t perform this action' };
    } else {
      ctx.status = 500;
    }
  }
}));

// CREATE
router.post('/schoolYears', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  const t = await db.sequelize.transaction();
  try {
    if (admin) {
      const yearsAlreadyExisting =  await db.SchoolYear.findAllBySchoolId(admin.schoolId);
      const newYear = {
        startAt: moment(ctx.request.body.startAt).startOf('day').toDate(),
        endAt: ctx.request.body.endAt ? moment(ctx.request.body.endAt).startOf('day').toDate() : null,
        schoolId: admin.schoolId,
        nbOfDaysOfHolidays: ctx.request.body.nbOfDaysOfHolidays,
      };

      if (periodsOverlap([...yearsAlreadyExisting, newYear])) {
        throw new Error('Overlap');
      }
      const schoolYear = await db.SchoolYear.create(newYear, { transaction: t });

      for (let nss of ctx.request.body.schoolYearSettings) {
        if (nss.usualOpenedDays.length) {
          const createdSchoolYearSettings = await db.SchoolYearSettings.create({
            schoolYearId: schoolYear.id,
            startAt: moment(nss.startAt).startOf('day').toDate(),
            endAt: nss.endAt ? moment(nss.endAt).startOf('day').toDate() : null,
          }, {
            transaction: t,
          });
          const usualOpenedDaysForThisNss = nss.usualOpenedDays.map(uod => ({ ...uod, schoolYearSettingsId: createdSchoolYearSettings.id }));
          await db.UsualOpenedDays.bulkCreate(usualOpenedDaysForThisNss, { transaction: t });
        }
      }

      await t.commit();
      ctx.body = await db.SchoolYear.findById(schoolYear.id);
    } else if (superAdmin) {
      console.log('Feature not available yet'); // TODO
    }
  } catch (e) {
    await t.rollback();

    if (e.message === 'Overlap') {
      ctx.status = 409;
      ctx.body = { status: 409, message: 'Les années ne doivent pas se superposer' };
    } else {
      console.log(`Can't create schoolYears for school ${admin.schoolId} :` , e);
      ctx.status = 500;
    }
  }
}));

// DELETE
router.delete('/schoolYears/:id', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  if (admin) {
    ctx.body = await db.SchoolYear.findByIdAndSchoolId(ctx.params.id, admin.schoolId);
    await db.SchoolYear.destroy({ where: { id: ctx.params.id, schoolId: admin.schoolId }});
  } else if (superAdmin) {
    ctx.body = await db.SchoolYear.findById(ctx.params.id);
    await db.SchoolYear.destroy({ where: { id: ctx.params.id }});
  }
}));
