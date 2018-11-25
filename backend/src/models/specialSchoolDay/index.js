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
