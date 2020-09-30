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
  stripeClientIds: {
    type: Sequelize.JSONB,
    defaultValue: [],
  },
  subscriptionId: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.TEXT,
  },
  emailSubject: {
    type: Sequelize.TEXT,
  },
  sms: {
    type: Sequelize.TEXT,
  },
  smsToken: {
    type: Sequelize.TEXT,
  },
  emailAddress: {
    type: Sequelize.TEXT,
  },
  emailToken: {
    type: Sequelize.TEXT,
  },
}, {
  paranoid: true,
  indexes: [{
    fields: ['urlName'],
    unique: true,
  }],
});

export default School;
