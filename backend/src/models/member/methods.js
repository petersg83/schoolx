import moment from 'moment';
import Member from './index';
import MemberSettings from '../memberSettings';
import MemberPeriodsAtSchool from '../memberPeriodsAtSchool';

Member.findById = (id) => Member.findOne({
  where: { id },
  include: [{ model: MemberSettings, as: 'memberSettings'}, { model: MemberPeriodsAtSchool, as: 'memberPeriodsAtSchool'}],
});

Member.findByIdAndSchoolId = (id, schoolId) => Member.findOne({
  where: { id, schoolId },
  include: [{ model: MemberSettings, as: 'memberSettings'}, { model: MemberPeriodsAtSchool, as: 'memberPeriodsAtSchool'}],
});

Member.createWithSettingsAndPeriods = memberWithSettingsAndPeriods => {
  const creationData = {
    firstName: memberWithSettingsAndPeriods.firstName,
    lastName: memberWithSettingsAndPeriods.lastName,
    birthday: memberWithSettingsAndPeriods.birthday,
    schoolId: memberWithSettingsAndPeriods.schoolId,
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

  console.log('creationData', creationData);

  return Member.create(creationData, {
    include: [{ model: MemberSettings, as: 'memberSettings'}, { model: MemberPeriodsAtSchool, as: 'memberPeriodsAtSchool'}],
  });
};
