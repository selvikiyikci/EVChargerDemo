module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn('users', 'email', {
          type: Sequelize.STRING,
          allowNull: true,
          unique: false,
      });
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn('users', 'email', {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true, 
      });
  }
};
