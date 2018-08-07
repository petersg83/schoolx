import Member from './index';
import School from '../school';

School.hasMany(Member, {
  foreignKey: 'schoolId',
  as: 'members',
});

Member.belongsTo(School, {
  foreignKey: 'schoolId',
  as: 'school',
});
