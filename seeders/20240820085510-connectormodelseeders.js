'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('connector', 'title', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('connector', 'power', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('connector', 'pricePerkWh', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('connector', 'lat', {
      type: Sequelize.FLOAT,
      allowNull: false
    });
    await queryInterface.addColumn('connector', 'long', {
      type: Sequelize.STRING,
      allowNull: false
    });


  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('connector', 'title');
    await queryInterface.removeColumn('connector', 'power');
    await queryInterface.removeColumn('connector', 'pricePerkWh');
    await queryInterface.removeColumn('connector', 'lat');
    await queryInterface.removeColumn('connector', 'long');
  }
};
