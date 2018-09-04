import MemberSettings from './index';
import Member from '../member';

Member.hasMany(MemberSettings, {
  foreignKey: 'memberId',
  as: 'memberSettings',
});

MemberSettings.belongsTo(Member, {
  foreignKey: 'memberId',
  as: 'member',
});
