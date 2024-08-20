const express = require('express');
const {sequelize} = require("../data/db");
const userController = require('../controller/userController');
const stationController = require("../controller/stationController");
const router = express.Router();
const {verifyToken} = require("../middlewares/verifyToken.js");
const { verify} = require('jsonwebtoken');
const connectorController = require("../controller/connectorController.js");
const transactionController = require('../controller/transactionController.js');


// router.get("/category/delete/:categoryid", adminController.get_category_delete);

router.post("/auth/phone-Number-approved", userController.phoneNumberCheck );
router.post("/auth/email-and-birthYear-Approved", verifyToken, userController.emailAndBirthYearCheck );
router.post("/auth/check-password", verifyToken, userController.passwordCheck);
router.post("/auth/check-TCKN",verifyToken, userController.TCKNcheck);
router.post("/auth/check-tax-number", verifyToken, userController.TaxNoCheck);
router.post("/auth/check-credit-card-infos", verifyToken, userController.CardInfoCheck);
router.post("/auth/login", verifyToken, userController.postLogin);
router.post("/list-charge-points", stationController.listChargePoints);
router.get("/charge-point/list-connectors/:stationId", connectorController.getStationById);
router.post("/charge-point/remote-start-transaction", transactionController.startChargingProcess);
router.post("/charge-point/remote-stop-transaction", transactionController.stopChargingProcess);
router.post("/charge-point/meter-values", transactionController.meterValues);
router.post("/add-connector", connectorController.addConnector);



/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});

sequelize.sync().then(() => {
  console.log("Database connection successfull");

},
(error)=>{
  console.log("Error is occurred", error);

}
)

module.exports = router;
