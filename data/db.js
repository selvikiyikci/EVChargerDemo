let dotenv = require("dotenv");
dotenv.config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        dialect: "mysql",
        logging: false,
    }
);
const users = require("../models/userModel");
const rfidCard = require("../models/rfidCardModel");
const station = require("../models/stationModel");
const connector = require("../models/connectorModel");

///

const userModel = users(sequelize, Sequelize);
const rfidCardModel = rfidCard(sequelize, Sequelize);
const connectorModel = connector(sequelize, Sequelize);
const stationModel = station(sequelize, Sequelize);

rfidCardModel.belongsTo(userModel, { foreignKey: "userId" })//bir 
userModel.hasMany(rfidCardModel, { foreignKey: "userId", as: "rfids" })



connectorModel.belongsTo(stationModel, { foreignKey: "stationId" })
stationModel.hasMany(connectorModel, { foreignKey: "stationId", as: "connectors" })



module.exports = {
    sequelize,
    Sequelize,
    userModel,
    connectorModel,
    rfidCardModel,
    stationModel
}







