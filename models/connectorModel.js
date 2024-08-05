module.exports = (sequelize, Sequelize) => {
    const station  = sequelize.define(
        "connector",
        {
            connectorID: {    
                autoIncrement: true,    
                type: Sequelize.STRING,
                primaryKey : true,
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
