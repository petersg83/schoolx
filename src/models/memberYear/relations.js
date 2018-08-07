import MemberYear from './index';
import Member from '../member';

Member.hasMany(MemberYear, {
  foreignKey: 'memberId',
  as: 'memberYears',
});

MemberYear.belongsTo(Member, {
  foreignKey: 'memberId',
  as: 'member',
});
