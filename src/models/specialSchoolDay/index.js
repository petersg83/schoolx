import { sequelize, Sequelize } from '../../database';

const SpecialSchoolDay = sequelize.define('specialSchoolDay', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  schoolId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isClosed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  day: {
    type: Sequelize.DATE,
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
  minTimeBeforePartialAbsence: {
    type: Sequelize.DATE,
  },
  minTimeBeforeTotalAbsence: {
    type: Sequelize.DATE,
  },
  note: {
    type: Sequelize.TEXT,
  }
}, {
  paranoid: true,
  indexes: [{
    fields: ['schoolId', 'day'],
    unique: true,
  }],
});

export default SpecialSchoolDay;
