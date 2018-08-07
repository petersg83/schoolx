import SchoolSettings from './index';
import School from '../school';

School.hasMany(SchoolSettings, {
  foreignKey: 'schoolId',
  as: 'schoolSettings',
});

SchoolSettings.belongsTo(School, {
  foreignKey: 'schoolId',
  as: 'school',
});
