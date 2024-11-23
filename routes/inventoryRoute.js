// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classificationValidation = require("../utilities/classification-validation")
const inventoryValidation = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.checkLogin, utilities.handleErrors(invController.buildByClassificationId));

// Route to find specific car details
router.get("/detail/:vehicleId", utilities.checkLogin, utilities.handleErrors(invController.buildVehicleDetails)); 

// Route to build the management page
router.get("/management", utilities.checkLogin, utilities.handleErrors(invController.showManagement));

// Route to build the add classification page
router.get('/add-classification', utilities.checkLogin, utilities.handleErrors(invController.showAddClassificationForm));

// Route to handle form submission in add-classification form
router.post('/add-classification', utilities.checkLogin,
    classificationValidation.classificationRules(),
    classificationValidation.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Route to build the add inventory page
router.get('/add-inventory', utilities.checkLogin, utilities.handleErrors(invController.showAddInventoryForm));

// Route to handle form submission in add-inventory form
router.post('/add-inventory', utilities.checkLogin,
    inventoryValidation.inventoryRules(),
    inventoryValidation.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);


module.exports = router;