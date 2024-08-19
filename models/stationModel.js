module.exports = (sequelize, Sequelize) => {
    const station = sequelize.define(
        "station",
        {
            chargePointid: {   
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'default_charge_point_id' // Varsayılan değer
            },
            areaId : {
                type : Sequelize.INTEGER,
                defaultValue : 1
            },
            name: {    
                type: Sequelize.STRING,
                allowNull: false
            },
        //
            district : {
                type : Sequelize.STRING,
                allowNull: false
            },
            city : {
                type : Sequelize.STRING,
                allowNull: false
            },
            accessTime : {
                type : Sequelize.STRING,
                allowNull: false
            },
        //
            latitude: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            longitude: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            distance: {
                type: Sequelize.STRING,
                allowNull: true
            },
            photoURL: {
                type: Sequelize.STRING,
                allowNull: false
            },
        

        },
        {
            timestamps: false, // Burada 'timestaps' yerine 'timestamps' kullanmanız gerekir.
            freezeTableName: true
        }
    );
    return station;
};
