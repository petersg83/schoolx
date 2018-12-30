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
