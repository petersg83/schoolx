import SchoolYearSettings from './index';
import SchoolYear from '../schoolYear';

SchoolYear.hasMany(SchoolYearSettings, {
  foreignKey: 'schoolYearId',
  as: 'schoolYearSettings',
});

SchoolYearSettings.belongsTo(SchoolYear, {
  foreignKey: 'schoolYearId',
  as: 'schoolYear',
});
