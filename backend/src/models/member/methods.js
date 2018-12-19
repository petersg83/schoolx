import moment from 'moment';
import Member from './index';
import MemberSettings from '../memberSettings';
import MemberPeriodsAtSchool from '../memberPeriodsAtSchool';
import SpecialMemberDay from '../specialMemberDay';
import School from '../school';

Member.findById = (id) => Member.findOne({
  where: { id },
  include: [{ model: MemberSettings, as: 'memberSettings'}, { model: MemberPeriodsAtSchool, as: 'memberPeriodsAtSchool'}],
});

Member.findByIdAndSchoolId = (id, schoolId) => Member.findOne({
  where: { id, schoolId },
  include: [{ model: MemberSettings, as: 'memberSettings'}, { model: MemberPeriodsAtSchool, as: 'memberPeriodsAtSchool'}],
});

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
    birthday: memberWithSettingsAndPeriods.birthday,
    schoolId: memberWithSettingsAndPeriods.schoolId,
    avatarPath: memberWithSettingsAndPeriods.avatarPath,
  };

  if (memberWithSettingsAndPeriods.daysOff && memberWithSettingsAndPeriods.daysOff.length) {
    creationData.memberSettings = [{
      daysOff: memberWithSettingsAndPeriods.daysOff,
      startAt: memberWithSettingsAndPeriods.arrivalDate || moment().startOf('date'),
    }];
  }

  if (memberWithSettingsAndPeriods.arrivalDate) {
    creationData.memberPeriodsAtSchool = [{
      startAt: moment(memberWithSettingsAndPeriods.arrivalDate).startOf('date'),
    }];
  }

  return Member.create(creationData, {
    include: [{ model: MemberSettings, as: 'memberSettings'}, { model: MemberPeriodsAtSchool, as: 'memberPeriodsAtSchool'}],
  });
};
