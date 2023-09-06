"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.addColumn("member", "pseudo", { type: Sequelize.DataTypes.STRING }, { transaction: t });
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.removeColumn("member", "pseudo", { transaction: t });
    });
  },
};
