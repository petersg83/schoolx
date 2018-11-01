import { sequelize, Sequelize } from '../../database';

const SchoolYearSettings = sequelize.define('schoolYearSettings', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  schoolYearId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  timezone: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'Europe/Paris',
  },
  startAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  endAt: {
    type: Sequelize.DATE,
  },
}, {
  indexes: [{
    fields: ['schoolYearId'],
  }],
});

export default SchoolYearSettings;
