module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('connector', 'createdAt');
    await queryInterface.removeColumn('connector', 'updatedAt');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('connector', 'createdAt', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    });
    await queryInterface.addColumn('connector', 'updatedAt', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    });
  }
};
