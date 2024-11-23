const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle details page
 * ************************** */
invCont.buildVehicleDetails = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId
  const data = await invModel.getVehicleById(vehicle_id)
  const grid = await utilities.buildVehicleGrid(data)
  let nav = await utilities.getNav()
  const vehicleName = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
  res.render("./inventory/vehicle", {
    title: vehicleName,
    nav,
    grid,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.showAddClassificationForm = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      message: req.flash("message"),
      errors: req.flash("errors"),
  });
};

/* Add a New Classification */
invCont.addClassification = async function (req, res, next) {
  const { classificationName } = req.body;
  try {
    // Assuming the validation happens in middleware now
    await invModel.addClassification(classificationName); // Insert the new classification
    req.flash("success", "New classification added successfully!");
    res.redirect("/inv/management"); // Corrected route to management
  } catch (error) {
    req.flash("errors", "Failed to add classification: " + error.message);
    res.redirect("/inv/add-classification"); // Redirect back to form
  }
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.showAddInventoryForm = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationListHtml = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    errors: null,
    classificationListHtml 

  });
};

/* Add a New Car to Inventory */
invCont.addInventory = async function (req, res, next) {
  let classificationListHtml = await utilities.buildClassificationList();
  const { inventoryMake, inventoryModel, inventoryImg, inventoryThum, inventoryPrice, inventoryYear, inventoryMiles, inventoryColor, inventoryClass } = req.body;
  try {
    const newInventory = {
      make: inventoryMake,
      model: inventoryModel,
      image: inventoryImg,
      thumbnail: inventoryThum,
      price: inventoryPrice,
      year: inventoryYear,
      miles: inventoryMiles,
      color: inventoryColor,
      classification: inventoryClass,
      classificationListHtml
    };
    // Insert the new classification into the database
    await invModel.addInventory(newInventory);

    // Flash success message and redirect to inventory management view
    req.flash("success", "New car successfully added to inventory!");
    res.redirect("/inv/management"); // Corrected route to management
  } catch (error) {
    // If insertion fails, flash the error and redirect back to the add classification page
    req.flash("errors", "Failed to add car: " + error.message);
    res.redirect("/inv/add-inventory"); // Redirect back to form
    // res.status(501).render("inventory/add-inventory", {
    //   title: "Add New Vehicle",
    //   nav,
    //   classificationListHtml,
    // }); // Corrected route to add classification
  }
};

/* ***************************
 *  Build management view
 * ************************** */
invCont.showManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav(); 
    const classificationListHtml = await utilities.buildClassificationList()
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationListHtml,
      message: req.flash("message"), 
    });
  } catch (error) {
    console.error("Error rendering management view:", error);
    next(error); // Pass the error to the error handler
  }
};

module.exports = invCont 