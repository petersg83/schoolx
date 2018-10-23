import { sequelize, Sequelize } from '../../database';

const MemberPeriodsAtSchool = sequelize.define('memberPeriodsAtSchool', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  memberId: {
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
}, {
  indexes: [{
    fields: ['memberId'],
  }],
});

export default MemberPeriodsAtSchool;
