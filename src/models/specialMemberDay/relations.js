import SpecialMemberDay from './index';
import Member from '../member';

Member.hasMany(SpecialMemberDay, {
  foreignKey: 'memberId',
  as: 'specialMemberDays',
});

SpecialMemberDay.belongsTo(Member, {
  foreignKey: 'memberId',
  as: 'member',
});
