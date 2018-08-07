import Admin from './index';
import School from '../school';

School.hasMany(Admin, {
  foreignKey: 'schoolId',
  as: 'admins',
});

Admin.belongsTo(School, {
  foreignKey: 'schoolId',
  as: 'school',
});
