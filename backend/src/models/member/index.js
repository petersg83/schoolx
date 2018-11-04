import { sequelize, Sequelize } from '../../database';

const Member = sequelize.define('member', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  schoolId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  birthday: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  passwordHash: {
    type: Sequelize.STRING,
  },
  jwt: {
    type: Sequelize.STRING,
  },
  avatarPath: {
    type: Sequelize.STRING,
  }
}, {
  paranoid: true,
  indexes: [{
    fields: ['schoolId'],
  }],
});

export default Member;
