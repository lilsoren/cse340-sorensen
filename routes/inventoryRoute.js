// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to find specific car details
router.get("/detail/:vehicleId", invController.buildVehicleDetails); 

module.exports = router;