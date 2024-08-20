'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('station', 'city', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('station', 'accessTime', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('station', 'city');
    await queryInterface.removeColumn('station', 'accessTime');
  }
};
