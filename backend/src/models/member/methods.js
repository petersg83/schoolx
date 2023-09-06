import moment from 'moment';
import Member from './index';
import MemberSettings from '../memberSettings';
import MemberPeriodsAtSchool from '../memberPeriodsAtSchool';
import SpecialMemberDay from '../specialMemberDay';
import School from '../school';
import SchoolYear from '../schoolYear';
import SchoolYearSettings from '../schoolYearSettings';
import SpecialSchoolDay from '../specialSchoolDay';
import UsualOpenedDays from '../usualOpenedDays';
import { isStringTimeStrictlyBefore, isStringTimeValid, stringTimeToMinutes } from '../../utils/dates';

Member.findById = (id) => Member.findOne({
  where: { id },
  include: [{ model: MemberSettings, as: 'memberSettings'}, { model: MemberPeriodsAtSchool, as: 'memberPeriodsAtSchool'}],
});

Member.findByIdAndSchoolId = (id, schoolId) => Member.findOne({
  where: { id, schoolId },
  include: [{ model: MemberSettings, as: 'memberSettings'}, { model: MemberPeriodsAtSchool, as: 'memberPeriodsAtSchool'}],
});

Member.getEmailsMetadata = async (memberIds, schoolId) => {
  const members = await Member.findAll({ where: { id: { $in: memberIds }, schoolId: schoolId } });
  const school = await School.findOne({ where: { id: schoolId } });

  const emailsMetadata = members.reduce((acc, m) => {
    const resp1 = {
      memberId: m.id,
      emailAddress: m.responsible1Email,
      phoneNumber: m.responsible1PhoneNumber,
      name: m.responsible1Name,
      memberName: `${m.firstName} ${m.lastName}`,
    };
    const resp2 = {
      memberId: m.id,
      emailAddress: m.responsible2Email,
      phoneNumber: m.responsible2PhoneNumber,
      name: m.responsible2Name,
      memberName: `${m.firstName} ${m.lastName}`,
    };

    return [...acc, resp1, resp2];
  }, []);

  return {
    emailsMetadata,
    school: {
      emailSubject: school.emailSubject,
      emailContent: school.email,
      smsContent: school.sms,
    }
  };
};

Member.getInAndOutMembersForSchoolAndDay = async (schoolId, date) => {
  const day = moment(date).startOf('day');
  const schoolIsOpenThisday = await School.isSchoolOpenOn(schoolId, day);

  if (!schoolIsOpenThisday) {
    return [];
  } else {
    return Member.findAll({
      attributes: { exclude: ['jwt', 'passwordHash'] },
      where: {
        schoolId,
      },
      include: [{
        model: MemberPeriodsAtSchool,
        as: 'memberPeriodsAtSchool',
        where: {
          startAt: { $lte: new Date(day) },
          $or: [{
            endAt: { $gte: new Date(day) },
          }, {
            endAt: null,
          }],
        },
      }, {
        model: MemberSettings,
        as: 'memberSettings',
        required: false,
        where: {
          startAt: { $lte: new Date(day) },
          $or: [{
            endAt: { $gte: new Date(day) },
          }, {
            endAt: null,
          }]
        },
      }, {
        model: SpecialMemberDay,
        as: 'specialMemberDays',
        required: false,
        where: {
          day: new Date(day),
        },
      }],
    });
  }
};

Member.getTodaysInAndOutMembers = (schoolId) => Member.getInAndOutMembersForSchoolAndDay(schoolId, moment());

Member.createWithSettingsAndPeriods = memberWithSettingsAndPeriods => {
  const creationData = {
    firstName: memberWithSettingsAndPeriods.firstName,
    lastName: memberWithSettingsAndPeriods.lastName,
    pseudo: memberWithSettingsAndPeriods.pseudo,
    birthday: memberWithSettingsAndPeriods.birthday,
    schoolId: memberWithSettingsAndPeriods.schoolId,
    phoneNumber: memberWithSettingsAndPeriods.phoneNumber,
    avatarPath: memberWithSettingsAndPeriods.avatarPath,
    email: memberWithSettingsAndPeriods.email,
    responsible1Name: memberWithSettingsAndPeriods.responsible1Name,
    responsible1Email: memberWithSettingsAndPeriods.responsible1Email,
    responsible1PhoneNumber: memberWithSettingsAndPeriods.responsible1PhoneNumber,
    responsible2Name: memberWithSettingsAndPeriods.responsible2Name,
    responsible2Email: memberWithSettingsAndPeriods.responsible2Email,
    responsible2PhoneNumber: memberWithSettingsAndPeriods.responsible2PhoneNumber,
  };

  if (memberWithSettingsAndPeriods.daysOff && memberWithSettingsAndPeriods.daysOff.length) {
    creationData.memberSettings = [{
      daysOff: memberWithSettingsAndPeriods.daysOff,
      startAt: moment(memberWithSettingsAndPeriods.arrivalDate || moment()).startOf('date').toDate(),
    }];
  }

  if (memberWithSettingsAndPeriods.arrivalDate) {
    creationData.memberPeriodsAtSchool = [{
      startAt: moment(memberWithSettingsAndPeriods.arrivalDate).startOf('date').toDate(),
    }];
  }

  return Member.create(creationData, {
    include: [{ model: MemberSettings, as: 'memberSettings'}, { model: MemberPeriodsAtSchool, as: 'memberPeriodsAtSchool'}],
  });
};

Member.getMembersDays = async (schoolId, fromDate, toDate, membersIds = null, withDaySettings = false) => {
  const membersIdsSearch = membersIds ? { id: { $in: membersIds } } : {};
  const members = await Member.findAll({
    where: { schoolId, ...membersIdsSearch },
    include: [
      {
        model: MemberSettings,
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
        model: MemberPeriodsAtSchool,
        as: 'memberPeriodsAtSchool',
        where: {
          $or: [
            { startAt: { $between: [fromDate, toDate] } },
            { endAt: { $between: [fromDate, toDate] } },
            { startAt: { $lte: fromDate }, $or: [{ endAt: { $gte: toDate } }, { endAt: null }] },
          ],
        },
      }, {
        model: SpecialMemberDay,
        as: 'specialMemberDays',
        required: false,
        day: { $between: [fromDate, toDate] },
      },
    ],
  });

  const schoolYears = await SchoolYear.findAll({
    where: {
      schoolId,
      $or: [
        { startAt: { $between: [fromDate, toDate] } },
        { endAt: { $between: [fromDate, toDate] } },
        { startAt: { $lte: fromDate }, $or: [{ endAt: { $gte: toDate } }, { endAt: null }] },
      ],
    },
    include: [{
      model: SchoolYearSettings,
      as: 'schoolYearSettings',
      where: {
        $or: [
          { startAt: { $between: [fromDate, toDate] } },
          { endAt: { $between: [fromDate, toDate] } },
          { startAt: { $lte: fromDate }, $or: [{ endAt: { $gte: toDate } }, { endAt: null }] },
        ],
      },
      include: [{
        model: UsualOpenedDays,
        as: 'usualOpenedDays',
      }],
    }],
  });

  const specialSchoolDays = await SpecialSchoolDay.findAll({
    where: {
      schoolId,
      day: { $between: [fromDate, toDate] },
    },
  });

  const specialSchoolDaysMap = {};
  specialSchoolDays.forEach((ssd) => { specialSchoolDaysMap[moment(ssd.day).startOf('day').toISOString()] = ssd; });

  const specialMembersDaysMap = {};
  const membersDays = {};
  members.forEach((member) => {
    membersDays[member.id] = [];
    specialMembersDaysMap[member.id] = {};
    member.specialMemberDays.forEach((smd) => {
      specialMembersDaysMap[member.id][moment(smd.day).startOf('day').toISOString()] = smd;
    });
  });

  for (let schoolYear of schoolYears) {
    for (let thisSchoolYearSettings of schoolYear.schoolYearSettings) {
      const day = moment.max(moment(thisSchoolYearSettings.startAt).startOf('day'), moment(fromDate));
      const settingsEndAt = moment.min(moment(thisSchoolYearSettings.endAt || '9999-12-01').startOf('day'), moment(toDate), moment(schoolYear.endAt));
      while (day.isSameOrBefore(settingsEndAt)) {
        const usualOpenedDay = thisSchoolYearSettings.usualOpenedDays.find(uod => uod.days.includes(day.locale('en').format('dddd').toLowerCase()));
        const specialSchoolDay = specialSchoolDaysMap[day.toISOString()];
        const daySettings = specialSchoolDay || usualOpenedDay;
        for (let member of members) {
          const memberPeriodAtSchool = member.memberPeriodsAtSchool.find(mpas => moment(mpas.startAt).startOf('day').isSameOrBefore(day) && (!mpas.endAt || moment(mpas.endAt).startOf('day').isSameOrAfter(day)));
          if (daySettings && !daySettings.isClosed && memberPeriodAtSchool) {
            const memberSettingsForThisDay = member.memberSettings.find(ms => moment(ms.startAt).startOf('day').isSameOrBefore(day) && (!ms.endAt || moment(ms.endAt).startOf('day').isSameOrAfter(day)));
            const specialMemberDay = specialMembersDaysMap[member.id][day.toISOString()];
            const memberDay = {
              day: day.toISOString(),
              arrivedAt: (specialMemberDay && specialMemberDay.arrivedAt) || '',
              leftAt: (specialMemberDay && specialMemberDay.leftAt) || '',
            };
            if (withDaySettings) {
              Object.assign(memberDay, {
                schoolOpensAt: daySettings.openAt,
                schoolClosesAt: daySettings.closeAt,
                minTimeBefPartialAbsence: daySettings.minTimeBefPartialAbsence,
                minTimeBefTotalAbsence: daySettings.minTimeBefTotalAbsence,
                maxArrivalTime: daySettings.maxArrivalTime,
              });
            }
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

                const timeSpent = (+consideredLeftAt.split(':')[0] - consideredArrivedAt.split(':')[0]) * 60 + +consideredLeftAt.split(':')[1] - consideredArrivedAt.split(':')[1];
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
            } else if (day.isSameOrBefore(moment().startOf('day'))) {
              Object.assign(memberDay, {
                dayType: 'needed',
                delay: true,
                justifiedDelay: false,
                absence: 'total',
                justifiedAbsence: false,
              });
            }
            membersDays[member.id].push(memberDay);
          }
        }

        day.add(1, 'day');
      }
    }
  }

  members.forEach(member => membersDays[member.id].sort((md1, md2) => md1.day < md2.day ? -1 : 1 ));
  return membersDays;
};
