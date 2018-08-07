import { sequelize, Sequelize } from '../../database';

const SchoolSettings = sequelize.define('schoolSettings', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  schoolId: {
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
  paranoid: true,
  indexes: [{
    fields: ['schoolId'],
  }],
});

export default SchoolSettings;
