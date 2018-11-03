import { sequelize, Sequelize } from '../../database';

const UsualOpenedDays = sequelize.define('usualOpenedDays', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  schoolYearSettingsId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  days: {
    type: Sequelize.JSONB,
    defaultValue: [],
  },
  openAt: {
    type: Sequelize.STRING,
  },
  closeAt: {
    type: Sequelize.STRING,
  },
  maxArrivalTime: {
    type: Sequelize.STRING,
  },
  minTimeBefPartialAbsence: {
    type: Sequelize.STRING,
  },
  minTimeBefTotalAbsence: {
    type: Sequelize.STRING,
  },
}, {
  indexes: [{
    fields: ['schoolYearSettingsId'],
  }],
});

export default UsualOpenedDays;
