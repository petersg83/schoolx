import moment from 'moment';
import router from '../koa-router';
import db from '../db';
import { authRequired } from '../utils/auth';

router.get('/export', authRequired(['admin'], async (ctx, next, { admin }) => {
  const school = await db.School.findOne({
    where: { id: admin.schoolId },
    include: [{
      model: db.SpecialSchoolDay,
      as: 'specialSchoolDays',
    }, {
      model: db.SchoolYear,
      as: 'schoolYears',
      include: [{
        model: db.SchoolYearSettings,
        as: 'schoolYearSettings',
        include: [{
          model: db.UsualOpenedDays,
          as: 'usualOpenedDays',
        }],
      }],
    }],
  });

  // let from = moment('99999-12-31');
  // let to = moment(0);
  let today = moment().startOf('day');
  //
  // school.schoolYears.forEach((sy) => {
  //   const syStartAt = moment(sy.startAt).startOf('day');
  //   if (syStartAt.isBefore(from)) {
  //     from = syStartAt;
  //   }
  //
  //   const syEndAt = !!sy.endAt && moment(sy.endAt).startOf('day');
  //   if (syEndAt && syEndAt.isAfter(to)) {
  //     to = moment.min(syEndAt, today);
  //   } else if (!syEndAt) {
  //     to = today;
  //   }
  // });


  for (let schoolYear of school.schoolYears) {
    console.log('111');
    const from = moment(schoolYear.startAt).startOf('day');
    const to = schoolYear.endAt
      ? moment.min(moment(schoolYear.endAt).startOf('day'), today)
      : today;

    console.log('222');
    const membersDays = await db.Member.getMembersDays(school.id, new Date(from), new Date(to));
    console.log(JSON.stringify(membersDays, null, 2));

    // const indexFrom = moment(from);
    // const indexTo = moment.min(to, moment(from).endOf('month').startOf('day'));
    //
    // while (true) { // TO CHANGE
    //   db.Member.getMemberDays()
    // }
  }

  console.log(JSON.stringify(school, null, 2));
  ctx.body = {};
}));
