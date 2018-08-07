import { sequelize, Sequelize } from '../../database';

const MemberSettings = sequelize.define('memberSettings', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  memberId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  dayOff: {
    type: Sequelize.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
  },
  startAt: {
    type: Sequelize.DATE,
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

export default MemberSettings;
