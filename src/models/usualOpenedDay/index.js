import { sequelize, Sequelize } from '../../database';

const UsualOpenedDay = sequelize.define('usualOpenedDay', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  schoolSettingsId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
    allowNull: false,
  },
  openAt: {
    type: Sequelize.DATE,
  },
  closeAt: {
    type: Sequelize.DATE,
  },
  maxArrivalTime: {
    type: Sequelize.DATE,
  },
  minPresenceTimeBeforePartialAbsence: {
    type: Sequelize.DATE,
  },
  minPresenceTimeBeforeTotalAbsence: {
    type: Sequelize.DATE,
  },
}, {
  paranoid: true,
  indexes: [{
    fields: ['schoolSettingsId'],
  }],
});

export default UsualOpenedDay;
