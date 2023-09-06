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
  pseudo: {
    type: Sequelize.STRING,
  },
  birthday: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  phoneNumber: {
    type: Sequelize.STRING,
    default: '',
  },
  passwordHash: {
    type: Sequelize.STRING,
  },
  jwt: {
    type: Sequelize.STRING,
  },
  avatarPath: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  responsible1Name: {
    type: Sequelize.STRING,
  },
  responsible1Email: {
    type: Sequelize.STRING,
  },
  responsible1PhoneNumber: {
    type: Sequelize.STRING,
  },
  responsible2Name: {
    type: Sequelize.STRING,
  },
  responsible2Email: {
    type: Sequelize.STRING,
  },
  responsible2PhoneNumber: {
    type: Sequelize.STRING,
  },
}, {
  paranoid: true,
  indexes: [{
    fields: ['schoolId'],
  }],
});

export default Member;
