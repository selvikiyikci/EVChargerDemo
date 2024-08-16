const stationModel = require("./stationModel");

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
            },
//
            title : {
                type: Sequelize.STRING,
                allowNull: false
            },
            power : {
                type: Sequelize.STRING,
                allowNull: false
            },
            pricePerkWh: {
                type: Sequelize.STRING,
                allowNull: false
            },
            lat: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            long: {
                type: Sequelize.STRING,
                allowNull: false
            }
        },
        {
            timestamps: false,
            freezeTableName: true
        }
    );
    return connector;
};
