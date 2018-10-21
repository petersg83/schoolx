import { sequelize, Sequelize } from '../../database';

const Admin = sequelize.define('admin', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  schoolId: {
    type: Sequelize.STRING,
    allowNull: false,
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
  indexes: [{
    fields: ['schoolId', 'email'],
    unique: true,
  }],
});

export default Admin;
