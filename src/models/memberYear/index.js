import { sequelize, Sequelize } from '../../database';

const MemberYear = sequelize.define('memberYear', {
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
  paranoid: true,
  indexes: [{
    fields: ['memberId'],
  }],
});

export default MemberYear;
