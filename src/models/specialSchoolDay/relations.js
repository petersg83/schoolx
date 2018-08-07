import SpecialSchoolDay from './index';
import School from '../school';

School.hasMany(SpecialSchoolDay, {
  foreignKey: 'schoolId',
  as: 'specialSchoolDays',
});

SpecialSchoolDay.belongsTo(School, {
  foreignKey: 'schoolId',
  as: 'school',
});
