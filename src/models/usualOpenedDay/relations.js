import UsualOpenedDay from './index';
import SchoolSettings from '../schoolSettings';

SchoolSettings.hasMany(UsualOpenedDay, {
  foreignKey: 'schoolSettingsId',
  as: 'usualOpenedDays',
});

UsualOpenedDay.belongsTo(SchoolSettings, {
  foreignKey: 'schoolSettingsId',
  as: 'schoolSttings',
});
