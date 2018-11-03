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
  note: {
    type: Sequelize.TEXT,
  }
}, {
  indexes: [{
    fields: ['schoolId', 'day'],
    unique: true,
  }],
});

export default SpecialSchoolDay;
