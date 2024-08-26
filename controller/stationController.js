const { Op } = require("sequelize");
const { stationModel } = require("../data/db.js");
const { connectorModel} = require("../data/db.js")


const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (angle) => angle * (Math.PI / 180);
  const R = 6371; 
  const distanceLat = toRadians(lat2 - lat1);
  const distanceLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(distanceLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(distanceLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};


const getAcStationsWithSearchText = async (searchText, latRange, lonRange) => {
  return await stationModel.findAll({
    where: {
      chargePointid: {
        [Op.like]: "10%",
      },
      name: {
        [Op.like]: `%${searchText}%`,
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
};


const getAcStationsWithoutSearchText = async (latRange, lonRange) => {
  return await stationModel.findAll({
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
};


const getDcStationsWithSearchText = async (searchText, latRange, lonRange) => {
  return await stationModel.findAll({
    where: {
      chargePointid: {
        [Op.like]: "11%",
      },
      name: {
        [Op.like]: `%${searchText}%`,
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
};
  
const getDcStationsWithoutSearchText = async (latRange, lonRange) => {
  return await stationModel.findAll({
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
};


const calculateDistanceForStations = (stations, latitude, longitude) => {
  return stations.map((station) => {
    const distance = latitude && longitude ? haversineDistance(latitude,longitude,station.latitude,station.longitude ): null;

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

module.exports = {
  listChargePoints: async (req, res) => {
    try {
      const { latitude, longitude, searchText } = req.body;
      console.log("Girilen latitude bilgisi:", latitude);
      console.log("Girilen longitude bilgisi:", longitude);
      console.log("Search Text:", searchText);
      const latRange = latitude ? [parseFloat(latitude) - 0.5, parseFloat(latitude) + 0.5] : undefined;
      const lonRange = longitude ? [parseFloat(longitude) - 0.5, parseFloat(longitude) + 0.5] : undefined;
      const isSearchTextempty = !searchText || searchText.trim() === "";
      const filterStations = (stations, searchText) => {
   return stations.filter(station => 
    station.name.toLowerCase().includes(searchText.toLowerCase())
  );
};
      if (isSearchTextempty) {
        acStations = await getAcStationsWithoutSearchText(latRange, lonRange);
        dcStations = await getDcStationsWithoutSearchText(latRange, lonRange);
      } else {
        acStations = await getAcStationsWithSearchText(searchText, latRange, lonRange);
        acStations = filterStations(acStations, searchText);
        dcStations = await getDcStationsWithSearchText(searchText, latRange, lonRange);
        dcStations = filterStations(dcStations, searchText);
      }
   


      const acStationsWithDistance = calculateDistanceForStations(acStations, latitude, longitude);
      const dcStationsWithDistance = calculateDistanceForStations(dcStations, latitude, longitude);

      acStationsWithDistance.sort((a, b) => (a.distance - b.distance));
      dcStationsWithDistance.sort((a, b) => (a.distance - b.distance));

      res.status(200).json({
        "status": "success",
        "data": {
          acStations: acStationsWithDistance,
          dcStations: dcStationsWithDistance,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error occurred",
      });
    }
  },

  mapStations: async (req, res) => {
    const { acCondition, dcCondition, availableCondition } = req.params;
    const { searchText } = req.body; 

    try {
        let connectorConditions = {};
        if (acCondition === '1') {
            connectorConditions.chargePointid = { [Op.like]: '10%' };
        }
        if (dcCondition === '1') {
            connectorConditions.chargePointid = { [Op.like]: '11%' };
        }
        if (availableCondition === '1') {
            connectorConditions.status = { [Op.notIn]: ['CHARGING', 'FINISHING'] };
        }
        
    
        let stationConditions = {};
        if (connectorConditions.chargePointid) {
            stationConditions.chargePointid = connectorConditions.chargePointid;
        }
        
        if (searchText) {
            if (searchText.toUpperCase().includes('AC')) {
                stationConditions.chargePointid = { [Op.like]: '10%' };
            } else if (searchText.toUpperCase().includes('DC')) {
                stationConditions.chargePointid = { [Op.like]: '11%' };
            } else {
                stationConditions.name = { [Op.like]: `%${searchText}%` };
            }
        }

      
        const stations = await stationModel.findAll({
            where: stationConditions,
            include: [
                {
                    model: connectorModel,
                    as: 'connectors',
                  //  where: connectorConditions,
                   // attributes: ['id', 'connectorID', 'lat', 'long', 'photoURL']
                }
            ]
        });

        const data = stations.map(station => ({
          ChargePointId: station.id,
          Name: station.name,
          address: station.address,
          latitude: station.latitude,
          longitude: station.longitude,
          units: station.connectors.map(connector => ({   
              ChargePointId: station.chargePointid,
              Name: station.name,
              AreaId: station.areaId,
              xcoordinates: station.latitude,
              ycoordinates: station.longitude,
              detailPhotoLink: station.photoURL,
              connectors: {
                  id: connector.id,
                  ChargePointId: station.chargePointid,
                  ConnectorId: connector.connectorID,
                  areaID: station.areaId
              }
          })),
          latlng: {
              latitude: station.latitude,
              longitude: station.longitude
          }
      }));
        res.status(200).json({
            status: 'success',
            data
        });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({
            status: 'error',
            message: 'Bir hata oluştu',
            error: error.message
        });
    }
}
}