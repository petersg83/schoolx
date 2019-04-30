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
    allowNull: false,
  },
  jwt: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  trialUntil: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
  isFree: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  hasPaid: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  paymentFrequency: {
    type: Sequelize.STRING,
  },
  paymentAmount: {
    type: Sequelize.INTEGER,
  },
  stripeClientIds: {
    type: Sequelize.JSONB,
    defaultValue: [],
  },
}, {
  paranoid: true,
  indexes: [{
    fields: ['urlName'],
    unique: true,
  }],
});

export default School;
