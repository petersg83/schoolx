import moment from 'moment';
import router from '../koa-router';
import db from '../db';
import { authRequired } from '../utils/auth';
import { isStringTimeStrictlyBefore, isStringTimeValid, stringTimeToMinutes } from '../utils/dates';

router.get('/memberEvents', authRequired(['admin'], async (ctx, next, { admin, superAdmin }) => {
  if (ctx.query.currentDay && ctx.query.memberId) {
    admin.canEditMembers([ctx.query.memberId]);
    const fromDate = new Date(moment(+ctx.query.currentDay).startOf('month').subtract(2, 'months'));
    const toDate = new Date(moment(+ctx.query.currentDay).endOf('month').add(2, 'months'));

    ctx.body = await db.Member.getMemberDays(ctx.query.memberId, admin.schoolId, fromDate, toDate);
  } else {
    ctx.status = 400;
    ctx.body = { status: 400, message: "Bad request" };
  }
}));

router.put('/modifyMemberDay/:memberId', authRequired(['admin'], async (ctx, next, { admin, superAdmin }) => {
  if (ctx.request.body.memberDay && ctx.request.body.date) {
    admin.canEditMembers([ctx.params.memberId]);
    const memberId = ctx.params.memberId;
    const date = new Date (moment(ctx.request.body.date).startOf('day'));
    const memberDay = ctx.request.body.memberDay;
    if (
      !memberDay.isInHoliday &&
      !memberDay.arrivedAt &&
      !memberDay.leftAt &&
      !memberDay.isJustifiedDelay &&
      !memberDay.isJustifiedAbsence &&
      !memberDay.note
    ) {
      await db.SpecialMemberDay.destroy({
        where: {
          memberId,
          day: date,
        },
      });
    } else {
      await db.SpecialMemberDay.upsert({
        memberId,
        day: date,
        arrivedAt: memberDay.arrivedAt,
        leftAt: memberDay.leftAt,
        justifiedDelay: memberDay.isJustifiedDelay,
        justifiedAbsence: memberDay.isJustifiedAbsence,
        holiday: memberDay.isInHoliday,
        note: memberDay.note,
      });
    }
    ctx.body = {};
  }
}));

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

router.put('/specialSchoolDay', authRequired(['admin'], async (ctx, next, { admin, superAdmin }) => {
  const day = moment(ctx.request.body.day).startOf('day');

  const ssdAlreadyExisting = await db.SpecialSchoolDay.findOne({
    where: {
      schoolId: admin.schoolId,
      day,
    },
  });

  if (!ssdAlreadyExisting) {
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
    await db.SpecialSchoolDay.update({
      isClosed: ctx.request.body.isClosed,
      openAt: ctx.request.body.isClosed ? null : ctx.request.body.openAt,
      closeAt: ctx.request.body.isClosed ? null : ctx.request.body.closeAt,
      maxArrivalTime: ctx.request.body.isClosed ? null : ctx.request.body.maxArrivalTime,
      minTimeBefPartialAbsence: ctx.request.body.isClosed ? null : ctx.request.body.minTimeBefPartialAbsence,
      minTimeBefTotalAbsence: ctx.request.body.isClosed ? null : ctx.request.body.minTimeBefTotalAbsence,
      note: ctx.request.body.note,
    }, {
      where: {
        schoolId: admin.schoolId,
        day,
      },
    });

    ctx.body = await db.SpecialSchoolDay.findOne({
      where: {
        schoolId: admin.schoolId,
        day,
      },
    });
  }
}));

router.delete('/specialSchoolDay', authRequired(['admin'], async (ctx, next, { admin, superAdmin }) => {
  const day = moment(ctx.request.body.day).startOf('day');

  const ssdAlreadyExisting = await db.SpecialSchoolDay.findOne({
    where: {
      schoolId: admin.schoolId,
      day,
    },
  });

  if (ssdAlreadyExisting) {
    await db.SpecialSchoolDay.destroy({
      where: {
        schoolId: admin.schoolId,
        day,
      },
    });

    ctx.status = 200;
  } else {
    ctx.status = 409;
    ctx.body = { status: 409, message: "Ce jour spécial n'existe pas et ne peut donc pas être supprimé" };
  }
}));

router.get('/membersDay', authRequired(['admin'], async (ctx, next, { admin, superAdmin }) => {
  if (ctx.query.date) {
    const schoolIsOpenThisday = await db.School.isSchoolOpenOn(admin.schoolId, +ctx.query.date);
    if (!schoolIsOpenThisday) {
      ctx.body = { isSchoolOpen: false };
    } else {
      const day = new Date(moment(+ctx.query.date).startOf('day'));

      const members = await db.Member.findAll({
        where: { schoolId: admin.schoolId },
        include: [
          {
            model: db.MemberSettings,
            as: 'memberSettings',
            required: false,
            where: {
              startAt: { $lte: day },
              $or: [{
                endAt: { $gte: day },
              }, {
                endAt: null,
              }],
            },
          }, {
            model: db.MemberPeriodsAtSchool,
            as: 'memberPeriodsAtSchool',
            required: true,
            where: {
              startAt: { $lte: day },
              $or: [{
                endAt: { $gte: day },
              }, {
                endAt: null,
              }],
            },
          }, {
            model: db.SpecialMemberDay,
            as: 'specialMemberDays',
            required: false,
            where: {
              day,
            }
          },
        ],
      });

      const schoolYear = await db.SchoolYear.findOne({
        where: {
          schoolId: admin.schoolId,
          startAt: { $lte: day },
          $or: [{
            endAt: { $gte: day },
          }, {
            endAt: null,
          }],
        },
        include: [{
          model: db.SchoolYearSettings,
          as: 'schoolYearSettings',
          where: {
            startAt: { $lte: day },
            $or: [{
              endAt: { $gte: day },
            }, {
              endAt: null,
            }],
          },
          include: [{
            model: db.UsualOpenedDays,
            as: 'usualOpenedDays',
          }],
        }],
      });

      const specialSchoolDay = await db.SpecialSchoolDay.findOne({
        where: {
          schoolId: admin.schoolId,
          day,
        },
      });

      if (!schoolYear || !schoolYear.schoolYearSettings.length || !schoolYear.schoolYearSettings[0].usualOpenedDays) {
        throw new Error('School not supposed to be opened this day');
      }

      const membersDay = [];
      const momentDay = moment(day);
      const daySettings = specialSchoolDay
        ? specialSchoolDay
        : schoolYear.schoolYearSettings[0] && schoolYear.schoolYearSettings[0].usualOpenedDays.find(uod => uod.days.includes(momentDay.locale('en').format('dddd').toLowerCase()));
      daySettings.day = momentDay.toISOString();

      for (let member of members) {
        const memberSettings = member.memberSettings[0];
        const specialMemberDay = member.specialMemberDays[0];
        const memberDay = {
          memberId: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          arrivedAt: (specialMemberDay && specialMemberDay.arrivedAt) || '',
          leftAt: (specialMemberDay && specialMemberDay.leftAt) || '',
          note: (specialMemberDay && specialMemberDay.note) || '',
        };

        if (memberSettings && memberSettings.daysOff.includes(momentDay.locale('en').format('dddd').toLowerCase())) {
          Object.assign(memberDay, {
            dayType: 'dayOff',
            delay: false,
            justifiedDelay: false,
            absence: false,
            justifiedAbsence: false,
          });
        } else if (specialMemberDay && specialMemberDay.holiday) {
          Object.assign(memberDay, {
            dayType: 'holiday',
            delay: false,
            justifiedDelay: false,
            absence: false,
            justifiedAbsence: false,
            note: specialMemberDay.note,
          });
        } else if (specialMemberDay) {
          Object.assign(memberDay, {
            dayType: 'needed',
            note: specialMemberDay.note,
          });
          memberDay.delay = memberDay.arrivedAt && isStringTimeStrictlyBefore(daySettings.maxArrivalTime, memberDay.arrivedAt);

          if (!isStringTimeValid(memberDay.arrivedAt)) {
            memberDay.absence = 'total';
          } else if (!isStringTimeValid(memberDay.leftAt)) {
            memberDay.absence = 'undefined';
          } else {
            const consideredArrivedAt = isStringTimeStrictlyBefore(memberDay.arrivedAt, daySettings.openAt)
              ? daySettings.openAt
              : isStringTimeStrictlyBefore(memberDay.arrivedAt, daySettings.closeAt) ? memberDay.arrivedAt : daySettings.closeAt;
            const consideredLeftAt = isStringTimeStrictlyBefore(daySettings.closeAt, memberDay.leftAt)
              ? daySettings.closeAt
              : isStringTimeStrictlyBefore(memberDay.leftAt, daySettings.openAt) ? daySettings.openAt : memberDay.leftAt;

            const timeSpent = (+consideredLeftAt.split(':')[0] - consideredArrivedAt.split(':')[0]) * 60 + consideredLeftAt.split(':')[1] - consideredArrivedAt.split(':')[1];
            if (timeSpent < stringTimeToMinutes(daySettings.minTimeBefTotalAbsence)) {
              memberDay.absence = 'total';
            } else if (timeSpent < stringTimeToMinutes(daySettings.minTimeBefPartialAbsence)) {
              memberDay.absence = 'partial';
            } else {
              memberDay.absence = false;
            }
          }
          memberDay.justifiedDelay = memberDay.delay && !!specialMemberDay.justifiedDelay;
          memberDay.justifiedAbsence = memberDay.absence && !!specialMemberDay.justifiedAbsence;
        } else if (momentDay.isSameOrBefore(moment().startOf('day'))) {
          Object.assign(memberDay, {
            dayType: 'needed',
            delay: true,
            justifiedDelay: false,
            absence: 'total',
            justifiedAbsence: false,
          });
        }

        membersDay.push(memberDay);
      }

      ctx.body = { isSchoolOpen: true, membersDay, daySettings };
    }
  } else {
    ctx.status = 400;
    ctx.body = { status: 400, message: "Bad request" };
  }
}));

router.get('/memberSumUp', authRequired(['admin'], async (ctx, next, { admin }) => {
  if (ctx.query.memberId && (ctx.query.currentYear || (ctx.query.from && ctx.query.to))) {
    let from;
    let to;
    let today = new Date(moment().startOf('day'));

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
        to = schoolYear.endAt ? new Date(moment.min(moment(schoolYear.endAt).startOf('day'), moment().startOf('day'))) : null;
      }
    }

    if (!from || !to || isNaN(from) || isNaN(to)) {
      from = new Date(moment(+ctx.query.from).startOf('day'));
      to = new Date(moment(+ctx.query.to).startOf('day'));
    }

    if (!from || !to || isNaN(from) || isNaN(to)) {
      throw new Error('"From" and "to" dates are missing');
    }

    const memberDays = await db.Member.getMemberDays(ctx.query.memberId, admin.schoolId, from, to);

    const totalCounts = {
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
      from: from.valueOf(),
      to: to.valueOf(),
    };

    memberDays.forEach((md) => {
      if (md.dayType === 'dayOff') {
        totalCounts.nbOfDayOffTaken += 1;
      } else if (md.dayType === 'holiday') {
        totalCounts.nbOfHolidaysTaken += 1;
      } else if (md.dayType === 'needed') {
        if (md.delay) {
          totalCounts.nbOfDelays += 1;
          if (md.justifiedDelay) {
            totalCounts.nbOfJustifiedDelays += 1;
          }
        }
        if (md.absence === 'total') {
          totalCounts.nbOfTotalAbsences += 1;
          if (md.justifiedAbsence) {
            totalCounts.nbOfJustifiedTotalAbsences += 1;
          }
        } else if (md.absence === 'partial') {
          totalCounts.nbOfPartialAbsences += 1;
          if (md.justifiedAbsence) {
            totalCounts.nbOfJustifiedPartialAbsences += 1;
          }
        } else if (md.absence === 'undefined') {
          totalCounts.undefinedDays += 1;
        } else {
          totalCounts.nbOfTotalPresentDays += 1;
        }
        if (md.arrivedAt && md.leftAt && isStringTimeValid(md.arrivedAt) && isStringTimeValid(md.leftAt)) {
          totalCounts.nbOfTotalPresentMinutes += stringTimeToMinutes(md.leftAt) - stringTimeToMinutes(md.arrivedAt);
        }
      }
    });

    ctx.body = totalCounts;
  } else {
    ctx.status = 400;
    ctx.body = { status: 400, message: "Bad request" };
  }
}));
