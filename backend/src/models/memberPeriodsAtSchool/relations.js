import MemberPeriodsAtSchool from './index';
import Member from '../member';

Member.hasMany(MemberPeriodsAtSchool, {
  foreignKey: 'memberId',
  as: 'memberPeriodsAtSchool',
});

MemberPeriodsAtSchool.belongsTo(Member, {
  foreignKey: 'memberId',
  as: 'member',
});
