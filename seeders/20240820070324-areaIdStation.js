module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('station', 'areaId', {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('station', 'areaId');
  },
};
