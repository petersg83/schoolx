import { sequelize, Sequelize } from '../../database';

const SchoolYear = sequelize.define('schoolYear', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  schoolId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  startAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  endAt: {
    type: Sequelize.DATE,
  },
  nbOfDaysOfHolidays: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  }
}, {
  paranoid: true,
  indexes: [{
    fields: ['schoolId'],
  }],
});

export default SchoolYear;
