const { Op } = require("sequelize");
const { stationModel } = require("../data/db.js");
const userService = require("../services/userService.js");

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (angle) => angle * (Math.PI / 180);
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

module.exports = {
  listChargePoints: async (req, res) => {
    try {
      const { latitude, longitude } = req.body;
      console.log("Girilen latitude bilgisi:", latitude);
      console.log("Girilen longitude bilgisi:", longitude);

      const latRange = latitude ? [latitude - 0.1, latitude + 0.1] : undefined;
      const lonRange = longitude
        ? [longitude - 0.1, longitude + 0.1]
        : undefined;

      const acStations = await stationModel.findAll(userService, {
        where: {
          chargePointid: {
            [Op.like]: "10%",
          },
          ...(latRange && lonRange
            ? {
                latitude: {
                  [Op.between]: latRange,
                },
                longitude: {
                  [Op.between]: lonRange,
                },
              }
            : {}),
        },
      });
      console.log("AC Stations found:", acStations);
      // await userService.findOne(userModel,{
      //  where: {
      //  email: email
      //}
      // });
      // DC istasyonları
      const dcStations = await stationModel.findAll(userService, {
        where: {
          chargePointid: {
            [Op.like]: "11%",
          },
          ...(latRange && lonRange
            ? {
                latitude: {
                  [Op.between]: latRange,
                },
                longitude: {
                  [Op.between]: lonRange,
                },
              }
            : {}),
        },
      });
      console.log("DC Stations found:", dcStations);

      const calculateDistanceForStations = (stations) => {
        return stations.map((station) => {
          const distance =
            latitude && longitude
              ? haversineDistance(
                  latitude,
                  longitude,
                  station.latitude,
                  station.longitude
                )
              : null;
          console.log(`Calculating distance for station: ${station.name}`);
          console.log(`Distance: ${distance}`);

          return {
            chargePointid: station.chargePointid,
            name: station.name,
            latlng: {
              latitude: station.latitude,
              longitude: station.longitude,
            },
            distance: distance !== null ? distance.toFixed(1) : null,
            photoUrl: station.photoURL,
          };
        });
      };

      const acStationsWithDistance = calculateDistanceForStations(acStations);
      const dcStationsWithDistance = calculateDistanceForStations(dcStations);

      res.json({
        success: true,
        message: "Veriler başarıyla alındı.",
        acStations: acStationsWithDistance,
        dcStations: dcStationsWithDistance,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Bir hata oluştu.",
      });
    }
  },
};
