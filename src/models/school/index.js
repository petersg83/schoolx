import { sequelize, Sequelize } from '../../database';

const School = sequelize.define('school', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  name: {
    type: Sequelize.STRING,
  },
}, {
  paranoid: true,
  indexes: [{
    fields: ['name'],
    unique: true,
  }],
});

export default School;
