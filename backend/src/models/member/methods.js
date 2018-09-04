import moment from 'moment';
import Member from './index';
import MemberSettings from '../MemberSettings';

Member.findById = (id) => Member.findOne({
  where: { id },
  include: [{ model: MemberSettings, as: 'memberSettings'}],
});

Member.findByIdAndSchoolId = (id, schoolId) => Member.findOne({
  where: { id, schoolId },
  include: [{ model: MemberSettings, as: 'memberSettings'}],
});

Member.createWithSettings = memberWithSettings => Member.create({
  firstName: memberWithSettings.firstName,
  lastName: memberWithSettings.lastName,
  birthday: memberWithSettings.birthday,
  schoolId: memberWithSettings.schoolId,
  memberSettings: [{
    daysOff: memberWithSettings.daysOff,
    startAt: moment().startOf('date'),
  }],
}, {
  include: [{ model: MemberSettings, as: 'memberSettings'}],
});
