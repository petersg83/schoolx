import moment from 'moment';
import router from '../koa-router';
import db from '../db';
import { authRequired } from '../utils/auth';
import { isStringTimeValid, stringTimeToMinutes } from '../utils/dates';

router.get('/membersSumUp', authRequired(['admin'], async (ctx, next, { admin }) => {
  if (ctx.query.currentYear || (ctx.query.from && ctx.query.to)) {
    let from;
    let to;
    let today = new Date(moment().startOf('day'));
    const membersSumUp = [];

    if (ctx.query.currentYear === 'true') {
      const schoolYear = await db.SchoolYear.findOne({
        where: {
          schoolId: admin.schoolId,
          startAt: { $lte: today },
          $or: [{ endAt: { $gte: today } }, { endAt: null }],
        },
      });
      if (schoolYear) {
        from = new Date(moment(schoolYear.startAt).startOf('day'));
        to = today;
      }
    }

    if (!from || !to || isNaN(from) || isNaN(to)) {
      from = new Date(moment(+ctx.query.from).startOf('day'));
      to = new Date(moment(+ctx.query.to).startOf('day'));
    }

    if (!from || !to || isNaN(from) || isNaN(to)) {
      throw new Error('"From" and "to" dates are missing');
    }

    const membersDays = await db.Member.getMembersDays(admin.schoolId, from, to);
    const members = await db.Member.findAll({
      where: {
        id: { $in: Object.keys(membersDays) },
      },
      attributes: ['id', 'firstName', 'lastName', 'avatarPath'],
    });
    const membersMap = members.reduce((map, m) => ({ ...map, [m.id]: m }), {});

    for (let memberId in membersDays) {
      const memberDays = membersDays[memberId];

      const memberSumUp = {
        memberId,
        name: `${membersMap[memberId].firstName} ${membersMap[memberId].lastName}`,
        avatarPath: membersMap[memberId].avatarPath,
        nbOfTotalAbsences: 0,
        nbOfJustifiedTotalAbsences: 0,
        nbOfPartialAbsences: 0,
        nbOfJustifiedPartialAbsences: 0,
        nbOfDelays: 0,
        nbOfJustifiedDelays: 0,
        nbOfTotalPresentDays: 0,
        nbOfTotalPresentMinutes: 0,
        nbOfHolidaysTaken: 0,
        nbOfDayOffTaken: 0,
        undefinedDays: 0,
        totalNbOfNeededDays: memberDays.filter(md => md.dayType === 'needed').length,
        totalNbOfOpenedDays: memberDays.length,
      };

      memberDays.forEach((md) => {
        if (md.dayType === 'dayOff') {
          memberSumUp.nbOfDayOffTaken += 1;
        } else if (md.dayType === 'holiday') {
          memberSumUp.nbOfHolidaysTaken += 1;
        } else if (md.dayType === 'needed') {
          if (md.delay) {
            memberSumUp.nbOfDelays += 1;
            if (md.justifiedDelay) {
              memberSumUp.nbOfJustifiedDelays += 1;
            }
          }
          if (md.absence === 'total') {
            memberSumUp.nbOfTotalAbsences += 1;
            if (md.justifiedAbsence) {
              memberSumUp.nbOfJustifiedTotalAbsences += 1;
            }
          } else if (md.absence === 'partial') {
            memberSumUp.nbOfPartialAbsences += 1;
            if (md.justifiedAbsence) {
              memberSumUp.nbOfJustifiedPartialAbsences += 1;
            }
          } else if (md.absence === 'undefined') {
            memberSumUp.undefinedDays += 1;
          } else {
            memberSumUp.nbOfTotalPresentDays += 1;
          }
          if (md.arrivedAt && md.leftAt && isStringTimeValid(md.arrivedAt) && isStringTimeValid(md.leftAt)) {
            memberSumUp.nbOfTotalPresentMinutes += stringTimeToMinutes(md.leftAt) - stringTimeToMinutes(md.arrivedAt);
          }
        }
      });
      membersSumUp.push(memberSumUp);
    }

    ctx.body = {
      from: from.valueOf(),
      to: to.valueOf(),
      membersSumUp,
    };
  } else {
    ctx.status = 400;
    ctx.body = { status: 400, message: "Bad request" };
  }
}));
