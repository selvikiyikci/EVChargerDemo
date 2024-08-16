const { Op } = require("sequelize");
const { stationModel } = require("../data/db.js");
const { connectorModel } = require("../data/db.js");

module.exports = {
  getStationById: async (req, res) => {
    try {
      const { stationId } = req.params;
      const station = await stationModel.findOne({
        where: {
          chargePointid: stationId,
        },
        include: [
          {
            model: connectorModel,
            as: 'connectors',
          }
        ]
      });

      if (!station) {
        return res.status(404).json({ status: "error", message: "Station not found" });
      }


      const connectors = station.connectors ? station.connectors.map(connector => ({
        title: connector.title,
        power: connector.power,
        pricePerkWh: connector.pricePerkWh,
        status: connector.status,
        QRdata: {
          chargePointId: station.chargePointid,
          connectorId: connector.connectorID,
          areaId: station.areaId,
        },
        location: {
          lat: connector.lat,
          long: connector.long,
        },
      })) : [];

      res.status(200).json({
        status: "success",
        data: {
          ChargePointId: station.chargePointid,
          photoUrls: station.photoURL,
          chargePointName: station.name,
          district: station.district,
          city: station.city,
          accessTime: station.accessTime,
          coordinates: {
            longitude: station.longitude,
            latitude: station.latitude,
          },
          connectors,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: "Error occurred" });
    }
  },
};
