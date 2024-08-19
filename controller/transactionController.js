const fetch = require('node-fetch');
const { connectorModel } = require('../data/db.js');
const userService = require("../services/userService");
const fetchToken = require("../services/fetchToken.js");

let token; 
module.exports = {
    startChargingProcess: async (req, res) => {
        const { areaId, chargePointid, connectorID } = req.body;

        try {
            const token = await fetchToken('1'); 
            
            if (!token) {
                return res.status(401).json({ status: "error", message: "Token sağlanamadı." });
            }
            await userService.update(connectorModel,
                { status: "Preparing" },
                { where: { stationId: chargePointid, connectorID: connectorID } }
            );

            const response = await fetch("https://backend.voltgo.com.tr:5008/api/v1/charge-point/remote-start-transaction", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    areaId: areaId,
                    chargePointId: chargePointid,
                    connectorId: connectorID
                }),
            });

            const data = await response.json();

            if (data.status === "Accepted" && data.transactionId) {
                await userService.update(connectorModel,
                    { status: "Charging" },
                    { where: { stationId: chargePointid, connectorID: connectorID } }
                );
                res.json({
                    status: "Accepted",
                    transactionId: data.transactionId
                });
            } else {
                res.status(500).json({ status: "error", message: "Failed to start the charging process." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "error", message: "Error occurred while starting the charging process." });
        }
    },

    stopChargingProcess: async (req, res) => {
        const { areaId, chargePointid, transactionId, connectorID } = req.body;

        try {
            const token = await fetchToken('1'); 
            
            if (!token) {
                return res.status(401).json({ status: "error", message: "Token sağlanamadı." });
            }

            await userService.update(connectorModel,
                { status: "Finishing" },
                { where: { stationId: chargePointid, connectorID: connectorID } }
            );

            const response = await fetch("https://backend.voltgo.com.tr:5008/api/v1/charge-point/remote-stop-transaction", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    areaId: areaId,
                    chargePointId: chargePointid,
                    transactionId: transactionId    
                }),
            });

            const data = await response.json();

            if (data.status === "Accepted") {
                await userService.update(connectorModel,
                    { status: "Available" },
                    { where: { stationId: chargePointid, connectorID: connectorID } }
                );

                res.json({
                    status: "Accepted",
                    price: data.price
                });
            } else {
                res.status(500).json({ status: "error", message: "Failed to stop the charging process." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "error", message: "Error occurred while stopping the charging process." });
        }
    },
    meterValues: async (req, res) => {
        const { transactionId } = req.body;

        try {
        
            const token = await fetchToken('1');

            if (!token) {
                return res.status(401).json({ status: "error", message: "Token sağlanamadı." });
            }

            const response = await fetch("https://backend.voltgo.com.tr:5008/api/v1/charge-point/meter-values", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ transactionId })
            });

            const data = await response.json();

            res.json({
                status: "success",
                data: {
                    status: data.data.status,
                    type: data.data.type,
                    chargePointId: data.data.chargePointId,
                    connectorId: data.data.connectorId,
                    areaId: data.data.areaId,
                    chargeRateKW: data.data.chargeRateKW,
                    meterKWH: data.data.meterKWH ,
                    firstBatteryState: data.data.firstBatteryState,
                    soc: data.data.soc, 
                    price: data.data.price, 
                    temperature: data.data.temperature , 
                    lastStatusTime: data.data.lastStatusTime , 
                    chargingStartTime: data.data.chargingStartTime , 
                    chargingStopTime: data.data.chargingStopTime , 
                    stopReason: data.data.stopReason, 
                    stopTagId: data.data.stopTagId , 
                    timeElapsed: data.data.timeElapsed,
                    inactivity: data.data.inactivity , 
                    lastUpdatedTime: data.data.lastUpdatedTime, 
                    transactionId: data.data.transactionId, 
                    isCharging: data.data.isCharging  
                }
            });
        } catch (error) {
            console.error('Error fetching meter values:', error);
            res.status(500).json({ status: "error", message: "Error occurred while fetching meter values." });
        }
    }
};