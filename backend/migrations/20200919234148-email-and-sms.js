"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn("school", "email", { type: Sequelize.DataTypes.TEXT }, { transaction: t }),
        queryInterface.addColumn("school", "emailSubject", { type: Sequelize.DataTypes.TEXT }, { transaction: t }),
        queryInterface.addColumn("school", "sms", { type: Sequelize.DataTypes.TEXT }, { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("school", "email", { transaction: t }),
        queryInterface.removeColumn("school", "emailSubject", { transaction: t }),
        queryInterface.removeColumn("school", "sms", { transaction: t }),
      ]);
    });
  },
};
