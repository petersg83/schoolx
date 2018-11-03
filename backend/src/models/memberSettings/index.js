import { sequelize, Sequelize } from '../../database';

const days =  ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

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
  daysOff: {
    type: Sequelize.JSONB,
    defaultValue: [],
  },
  startAt: {
    type: Sequelize.DATE,
  },
  endAt: {
    type: Sequelize.DATE,
  },
}, {
  indexes: [{
    fields: ['memberId'],
  }],
  validate: {
    correctDaysOff: function() {
      if (!this.daysOff || this.daysOff.some(day => !days.includes(day))) {
        throw new Error("daysOff should be empty or an array of days. ex: ['monday', 'friday']");
      }
    },
  },
});

export default MemberSettings;
