// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classificationValidation = require("../utilities/classification-validation")
const inventoryValidation = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to find specific car details
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildVehicleDetails)); 

// Route to build the management page
router.get("/management", utilities.checkAccountType, utilities.handleErrors(invController.showManagement));

// Route to build the add classification page
router.get('/add-classification', utilities.checkAccountType, utilities.handleErrors(invController.showAddClassificationForm));

// Route to handle form submission in add-classification form
router.post('/add-classification', utilities.checkAccountType,
    classificationValidation.classificationRules(),
    classificationValidation.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Route to build the add inventory page
router.get('/edit-inventory', utilities.checkAccountType, utilities.handleErrors(invController.showAddInventoryForm));

// Route to handle form submission in add-inventory form
router.post('/edit-inventory', utilities.checkAccountType,
    inventoryValidation.inventoryRules(),
    inventoryValidation.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);

// Route to build the add inventory page
router.get('/add-inventory', utilities.checkAccountType, utilities.handleErrors(invController.showAddInventoryForm));

// Route that allows us to select and change inventory items using js
router.get("/getInventory/:classification_id", utilities.checkAccountType, utilities.handleErrors(invController.getInventoryJSON))

// Route to build the "modity inventory items" page
router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView))

// Route that matches the edit-inventory's submit button action attribute
router.post("/update/", utilities.checkAccountType, utilities.handleErrors(invController.updateInventory));

router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.deleteInventoryView))
router.post("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.deleteInventory))


module.exports = router;