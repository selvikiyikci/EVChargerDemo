module.exports = (sequelize, Sequelize) => {
    const connector  = sequelize.define(
        "connector",
        {
            connectorID: {    
              
                type: Sequelize.STRING,
                allowNull: false
            },
           
            status: {
                type: Sequelize.ENUM,
                values: ["Available", "Preparing", "Charging", "Finishing", "Unavailable"],
                allowNull: false
            }
        },
        {
            freezeTableName: true
        }
    );
    return connector;
};
