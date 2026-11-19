import moment from 'moment';
import router from '../koa-router';
import db from '../db';
import { inAndOutAuthRequired, getSubdomainFromOrigin } from '../utils/auth';


router.get('/inandout', inAndOutAuthRequired(async (ctx, next, school) => {
  try {
    ctx.body = await db.Member.getTodaysInAndOutMembers(school.id);
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.body = { status: 500, message: e.message };
  }
}));

router.get('/todaySettings', inAndOutAuthRequired(async (ctx, next, school) => {
  const todaySettings = await db.School.getSettingsForSchoolDay(school.id, moment().toISOString());

  ctx.body = {
    ...todaySettings,
    schoolName: school.name,
  };
}));

router.post('/inandout/:memberId', inAndOutAuthRequired(async (ctx, next, school) => {
  const member = await db.Member.findByIdAndSchoolId(ctx.params.memberId, school.id);
  const isSchoolOpenToday = await db.School.isSchoolOpenOn(school.id, moment().toISOString());
  const now = moment();

  try {
    if (!member) {
      throw new Error("Member doesn't exist");
    }
    if (!isSchoolOpenToday) {
      throw new Error("School is not open");
    }

    const currentSpecialMemberDay = await db.SpecialMemberDay.findOne({
      where: {
        day: new Date(moment(now).startOf('day')),
        memberId: ctx.params.memberId,
      },
    });

    if ((!currentSpecialMemberDay || !currentSpecialMemberDay.arrivedAt) && ctx.request.body.action === 'arrived') {
      await db.SpecialMemberDay.upsert({
        memberId: ctx.params.memberId,
        day: new Date(moment(now).startOf('day')),
        arrivedAt: moment(now).format('HH:mm'),
      });
    } else if (currentSpecialMemberDay && currentSpecialMemberDay.arrivedAt && !currentSpecialMemberDay.leftAt && ctx.request.body.action === 'left') {
      await currentSpecialMemberDay.update({
        leftAt: moment().format('HH:mm'),
        leftTemporarlyAt: null,
      });
    } else if (currentSpecialMemberDay && currentSpecialMemberDay.arrivedAt && !currentSpecialMemberDay.leftAt && ctx.request.body.action === 'leftTemporarly') {
      await currentSpecialMemberDay.update({
        leftTemporarlyAt: moment().format('HH:mm'),
      });
    } else if (currentSpecialMemberDay && currentSpecialMemberDay.arrivedAt && !currentSpecialMemberDay.leftAt && ctx.request.body.action === 'comesBack') {
      await currentSpecialMemberDay.update({
        leftTemporarlyAt: null,
      });
    } else {
      throw new Error('action not possible');
    }

    ctx.body = {};
  } catch (e) {
    console.log('e', e);
    if (e.message === "Member doesn't exist") {
      ctx.status = 404;
      ctx.body = { status: 404, message: 'This member does not exit' };
    } else if (e.message === "School is not open") {
      ctx.status = 404;
      ctx.body = { status: 404, message: 'The school is not open today' };
    } else if (e.message === 'action not possible') {
      ctx.status = 500;
      ctx.body = { status: 500, message: 'Action doesnt match database state for the specialMemberDay' };
    } else {
      ctx.status = 500;
      ctx.body = { status: 500, message: 'Unknown error' };
    }
  }
}));

router.post('/inandoutlogin', async (ctx, next) => {
  const params = ctx.request.body;
  const subdomain = getSubdomainFromOrigin(ctx);
  let inandoutjwt;
  try {
    const schoolId = await db.School.getSchoolIdBySubdomain(subdomain);
    inandoutjwt = await db.School.getJWTByAccessCode(schoolId, params.accessCode);
  } catch (e) {
    inandoutjwt = null;
  }

  if (inandoutjwt) {
    ctx.body = { inandoutjwt };
  } else {
    ctx.status = 403;
    ctx.body = { status: 403, message: 'Access code is incorrect' };
  }
});
