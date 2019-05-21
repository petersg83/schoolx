import { sequelize, Sequelize } from '../../database';

const SubscriptionPlan = sequelize.define('subscriptionPlan', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  frequency: {
    type: Sequelize.ENUM('month', 'year'),
    allowNull: false,
  },
  stripePlanId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  available: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  }
});

export default SubscriptionPlan;
