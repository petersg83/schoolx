import SchoolYear from './index';
import School from '../school';

School.hasMany(SchoolYear, {
  foreignKey: 'schoolId',
  as: 'schoolYears',
});

SchoolYear.belongsTo(School, {
  foreignKey: 'schoolId',
  as: 'school',
});
