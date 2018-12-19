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
    const currentDay = new Date(moment(+ctx.query.currentDay).startOf('day'));

    const member = await db.Member.findOne({
      where: { id: ctx.query.memberId },
      include: [
        {
          model: db.MemberSettings,
          as: 'memberSettings',
          required: false,
          where: {
            $or: [
              { startAt: { $between: [fromDate, toDate] } },
              { endAt: { $between: [fromDate, toDate] } },
              { startAt: { $lte: fromDate }, $or: [{ endAt: { $gte: toDate } }, { endAt: null }] },
            ],
          },
        }, {
          model: db.MemberPeriodsAtSchool,
          as: 'memberPeriodsAtSchool',
          required: false,
          where: {
            $or: [
              { startAt: { $between: [fromDate, toDate] } },
              { endAt: { $between: [fromDate, toDate] } },
              { startAt: { $lte: fromDate }, $or: [{ endAt: { $gte: toDate } }, { endAt: null }] },
            ],
          },
        }, {
          model: db.SpecialMemberDay,
          as: 'specialMemberDays',
          required: false,
          day: { $between: [fromDate, toDate] },
        },
      ],
    });
    if (!member) {
      throw new Error("Le membre demandé n'existe pas");
    }

    const schoolYears = await db.SchoolYear.findAll({
      where: {
        schoolId: admin.schoolId,
        $or: [
          { startAt: { $between: [fromDate, toDate] } },
          { endAt: { $between: [fromDate, toDate] } },
          { startAt: { $lte: fromDate }, $or: [{ endAt: { $gte: toDate } }, { endAt: null }] },
        ],
      },
      include: [{
        model: db.SchoolYearSettings,
        as: 'schoolYearSettings',
        where: {
          $or: [
            { startAt: { $between: [fromDate, toDate] } },
            { endAt: { $between: [fromDate, toDate] } },
            { startAt: { $lte: fromDate }, $or: [{ endAt: { $gte: toDate } }, { endAt: null }] },
          ],
        },
        include: [{
          model: db.UsualOpenedDays,
          as: 'usualOpenedDays',
        }],
      }],
    });

    const specialSchoolDays = await db.SpecialSchoolDay.findAll({
      where: {
        schoolId: admin.schoolId,
        day: { $between: [fromDate, toDate] },
      },
    });

    const specialSchoolDaysMap = {};
    specialSchoolDays.forEach((ssd) => { specialSchoolDaysMap[moment(ssd.day).startOf('day').toISOString()] = ssd; });

    const specialMemberDaysMap = {};
    member.specialMemberDays.forEach((smd) => { specialMemberDaysMap[moment(smd.day).startOf('day').toISOString()] = smd; });

    const memberDays = [];

    for (let schoolYear of schoolYears) {
      for (let thisSchoolYearSettings of schoolYear.schoolYearSettings) {
        const day = moment(thisSchoolYearSettings.startAt).startOf('day');
        const settingsEndAt = thisSchoolYearSettings.endAt ? moment(thisSchoolYearSettings.endAt).startOf('day') : moment(toDate);
        while (day.isSameOrBefore(settingsEndAt)) {
          const usualOpenedDay = thisSchoolYearSettings.usualOpenedDays.find(uod => uod.days.includes(day.locale('en').format('dddd').toLowerCase()));
          const specialSchoolDay = specialSchoolDaysMap[day.toISOString()];
          const daySettings = specialSchoolDay || usualOpenedDay;
          const memberPeriodAtSchool = member.memberPeriodsAtSchool.find(mpas => moment(mpas.startAt).startOf('day').isSameOrBefore(day) && (!mpas.endAt || moment(mpas.endAt).startOf('day').isSameOrAfter(day)));
          if (daySettings && !daySettings.isClosed && memberPeriodAtSchool) {
            const memberSettingsForThisDay = member.memberSettings.find(ms => moment(ms.startAt).startOf('day').isSameOrBefore(day) && (!ms.endAt || moment(ms.endAt).startOf('day').isSameOrAfter(day)));
            const specialMemberDay = specialMemberDaysMap[day.toISOString()];
            const memberDay = {
              day: day.toISOString(),
              arrivedAt: (specialMemberDay && specialMemberDay.arrivedAt) || '',
              leftAt: (specialMemberDay && specialMemberDay.leftAt) || '',
              schoolOpensAt: daySettings.openAt,
              schoolClosesAt: daySettings.closeAt,
              minTimeBefPartialAbsence: daySettings.minTimeBefPartialAbsence,
              minTimeBefTotalAbsence: daySettings.minTimeBefTotalAbsence,
              maxArrivalTime: daySettings.maxArrivalTime,
            };
            if (memberSettingsForThisDay && memberSettingsForThisDay.daysOff.includes(day.locale('en').format('dddd').toLowerCase())) {
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
                arrivedAt: specialMemberDay.arrivedAt || '',
                leftAt: specialMemberDay.leftAt || '',
                note: specialMemberDay.note,
              });
              memberDay.delay = memberDay.arrivedAt && isStringTimeStrictlyBefore(memberDay.maxArrivalTime, memberDay.arrivedAt);

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
                if (timeSpent < stringTimeToMinutes(memberDay.minTimeBefTotalAbsence)) {
                  memberDay.absence = 'total';
                } else if (timeSpent < stringTimeToMinutes(memberDay.minTimeBefPartialAbsence)) {
                  memberDay.absence = 'partial';
                } else {
                  memberDay.absence = false;
                }
              }
              memberDay.justifiedDelay = memberDay.delay && !!specialMemberDay.justifiedDelay;
              memberDay.justifiedAbsence = memberDay.absence && !!specialMemberDay.justifiedAbsence;
            } else if (day.isSameOrBefore(moment().startOf('day'))) {
              Object.assign(memberDay, {
                dayType: 'needed',
                delay: true,
                justifiedDelay: false,
                absence: 'total',
                justifiedAbsence: false,
              });
            }
            memberDays.push(memberDay);
          }
          day.add(1, 'day');
        }
      }
    }
    ctx.body = memberDays.sort((md1, md2) => md1.day < md2.day);
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
          memberId: member.memberId,
          firstName: member.firstName,
          lastName: member.lastName,
          arrivedAt: (specialMemberDay && specialMemberDay.arrivedAt) || '',
          leftAt: (specialMemberDay && specialMemberDay.leftAt) || '',
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
