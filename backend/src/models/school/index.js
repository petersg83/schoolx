import { sequelize, Sequelize } from '../../database';

const School = sequelize.define('school', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  urlName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  accessCode: {
    type: Sequelize.STRING,
    defaultValue: '0123456789',
  },
  jwt: {
    type: Sequelize.STRING,
  },
}, {
  paranoid: true,
  indexes: [{
    fields: ['urlName'],
    unique: true,
  }],
});

export default School;
