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
    allowNull: false,
  },
  closeAt: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  maxArrivalTime: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  minTimeBefPartialAbsence: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  minTimeBefTotalAbsence: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  indexes: [{
    fields: ['schoolYearSettingsId'],
  }],
});

export default UsualOpenedDays;
