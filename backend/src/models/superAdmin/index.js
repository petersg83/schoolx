import { sequelize, Sequelize } from '../../database';

const SuperAdmin = sequelize.define('superAdmin', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Email address must be valid',
      },
    },
  },
  passwordHash: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  jwt: {
    type: Sequelize.STRING,
  }
}, {
  paranoid: true,
  indexes: [{
    fields: ['email'],
    unique: true,
  }],
});

export default SuperAdmin;
