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
    type: Sequelize.DATE,
  },
  closeAt: {
    type: Sequelize.DATE,
  },
  maxArrivalTime: {
    type: Sequelize.DATE,
  },
  minTimeBefPartialAbsence: {
    type: Sequelize.DATE,
  },
  minTimeBefTotalAbsence: {
    type: Sequelize.DATE,
  },
}, {
  indexes: [{
    fields: ['schoolYearSettingsId'],
  }],
});

export default UsualOpenedDays;
