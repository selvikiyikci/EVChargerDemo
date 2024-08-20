module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('station', 'district', {
      type : Sequelize.STRING,
      allowNull: false
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('station', 'district');
  },
};
