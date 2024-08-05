module.exports = (sequelize, Sequelize) => {
    const station  = sequelize.define(
        "station",
        {
            chargePointID: {
                autoIncrement: true,    
                type: Sequelize.STRING,
                primaryKey : true,
                allowNull: false
            },
            areaID : {
                type : Sequelize.STRING,
                allowNull : false
             },
            name : {
                type: Sequelize.STRING,
                allowNull: false
            },
            address : {
                type : Sequelize.STRING,
                allowNull : false
            },
            city : {
                type : Sequelize.STRING,
                allowNull : false
            },
            district : {
                type : Sequelize.STRING,
                allowNull : false
            }
        },
        {
            freezeTableName: true
        }
    );
    return Location;
};
