import { sequelize, Sequelize } from '../../database';

const SpecialMemberDay = sequelize.define('specialMemberDay', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  memberId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  day: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  arrivedAt: {
    type: Sequelize.DATE,
  },
  leftAt: {
    type: Sequelize.DATE,
  },
  justifiedDelay: {
    type: Sequelize.BOOLEAN,
  },
  justifiedAbsence: {
    type: Sequelize.BOOLEAN,
  },
  holiday: {
    type: Sequelize.BOOLEAN,
  },
  note: {
    type: Sequelize.TEXT,
  },
}, {
  paranoid: true,
  indexes: [{
    fields: ['memberId', 'day'],
    unique: true,
  }],
});

export default SpecialMemberDay;
