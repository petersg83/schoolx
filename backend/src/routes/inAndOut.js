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
router.get('/todaySettings', async (ctx, next) => {
  const subdomain = ctx.request.header.origin.split('//')[1].split('.')[0];
  const school = await db.School.getSchoolBySubdomain(subdomain);
  const todaySettings = await db.School.getSettingsForSchoolDay(school.id, moment().toISOString());

  ctx.body = {
    ...todaySettings,
    schoolName: school.name,
  };
});

// TODO: Sécuriser cette appel API
router.post('/inandout/:memberId', async (ctx, next) => {
  const subdomain = ctx.request.header.origin.split('//')[1].split('.')[0];
  const schoolId = await db.School.getSchoolIdBySubdomain(subdomain);
  const member = db.Member.findByIdAndSchoolId(ctx.params.memberId, schoolId);
  const isSchoolOpenToday = await db.School.isSchoolOpenOn(schoolId, moment().toISOString());
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

    if (!currentSpecialMemberDay && ctx.request.body.action === 'arrived') {
      db.SpecialMemberDay.create({
        memberId: ctx.params.memberId,
        day: new Date(moment(now).startOf('day')),
        arrivedAt: moment(now).format('HH:mm'),
      });
    } else if (currentSpecialMemberDay && currentSpecialMemberDay.arrivedAt && !currentSpecialMemberDay.leftAt && ctx.request.body.action === 'left') {
      currentSpecialMemberDay.update({
        leftAt: moment().format('HH:mm'),
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
    }
  }

});
