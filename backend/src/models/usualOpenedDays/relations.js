import UsualOpenedDays from './index';
import SchoolYearSettings from '../schoolYearSettings';

SchoolYearSettings.hasMany(UsualOpenedDays, {
  foreignKey: 'schoolYearSettingsId',
  as: 'usualOpenedDays',
});

UsualOpenedDays.belongsTo(SchoolYearSettings, {
  foreignKey: 'schoolYearSettingsId',
  as: 'schoolYearSettings',
});
