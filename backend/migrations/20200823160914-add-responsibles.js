"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn("member", "email", { type: Sequelize.DataTypes.STRING }, { transaction: t }),
        queryInterface.addColumn("member", "responsible1Name", { type: Sequelize.DataTypes.STRING }, { transaction: t }),
        queryInterface.addColumn("member", "responsible1Email", { type: Sequelize.DataTypes.STRING }, { transaction: t }),
        queryInterface.addColumn("member", "responsible1PhoneNumber", { type: Sequelize.DataTypes.STRING }, { transaction: t }),
        queryInterface.addColumn("member", "responsible2Name", { type: Sequelize.DataTypes.STRING }, { transaction: t }),
        queryInterface.addColumn("member", "responsible2Email", { type: Sequelize.DataTypes.STRING }, { transaction: t }),
        queryInterface.addColumn("member", "responsible2PhoneNumber", { type: Sequelize.DataTypes.STRING }, { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("member", "email", { transaction: t }),
        queryInterface.removeColumn("member", "responsible1Name", { transaction: t }),
        queryInterface.removeColumn("member", "responsible1Email", { transaction: t }),
        queryInterface.removeColumn("member", "responsible1PhoneNumber", { transaction: t }),
        queryInterface.removeColumn("member", "responsible2Name", { transaction: t }),
        queryInterface.removeColumn("member", "responsible2Email", { transaction: t }),
        queryInterface.removeColumn("member", "responsible2PhoneNumber", { transaction: t }),
      ]);
    });
  },
};
