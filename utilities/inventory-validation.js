const { body, validationResult } = require("express-validator");
const utilities = require("../utilities/");
const validate = {};

/* **********************************
 *  Inventory Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // Validate inventoryMake: required and at least 3 characters long
    body("inventoryMake")
      .trim()
      .notEmpty()
      .withMessage("Make is required.")
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters long."),

    // Validate inventoryModel: required and at least 3 characters long
    body("inventoryModel")
      .trim()
      .notEmpty()
      .withMessage("Model is required.")
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters long."),

    // Validate inventoryImg: optional, must be a valid URL if provided
    body("inventoryImg")
      .optional()
      .isURL()
      .withMessage("Please provide a valid image URL."),

    // Validate inventoryThum: optional, must be a valid URL if provided
    body("inventoryThum")
      .optional()
      .isURL()
      .withMessage("Please provide a valid thumbnail URL."),

    // Validate inventoryPrice: required, must be a valid decimal number (with up to two decimal places)
    body("inventoryPrice")
      .trim()
      .notEmpty()
      .withMessage("Price is required.")
      .isDecimal({ decimal_digits: '0,2' })
      .matches(/^\d+([.]\d+)?$/)
      .withMessage("Price must be a valid number with up to two decimal places."),

    // Validate inventoryYear: required, must be a valid 4-digit number
    body("inventoryYear")
      .notEmpty()
      .withMessage("Year is required.")
      //.isInt({ min: 1900, max: new Date().getFullYear() })
      .matches(/^\d{4}$/)
      .withMessage("Year must be a valid 4-digit number."),

    // Validate inventoryMiles: optional, must be a valid integer
    body("inventoryMiles")
      .optional()
      .isInt()
      .matches(/^\d+([.]\d+)?$/)
      .withMessage("Miles must be a valid number."),

    // Validate inventoryColor: required
    body("inventoryColor")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),

    // Validate inventoryClass (classification): required, must be a valid MongoDB ObjectId
    body("inventoryClass")
      .notEmpty()
      .withMessage("Classification is required.")
      .isNumeric()
      .withMessage("Invalid classification ID."),
  ];
};

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  console.log("Body in check inv rules", req.body)
  let classificationList = await utilities.buildClassificationList();
  const errors = validationResult(req); // Check for validation errors
  
  if (!errors.isEmpty()) {
    // If there are errors, render the add-inventory page with error messages
    let nav = await utilities.getNav();
    const locals = req.body; // Retain form data so the user doesn't lose their input

    res.render("inventory/edit-inventory", {
      title: "Add New Vehicle",
      nav,
      errors, // Display errors
      locals, // Retain input values
      classificationList
    });
    return; // Stop further processing
  }
  
  next(); // If no validation errors, proceed to the next middleware
};

/* ******************************
 * Errors will be directed back to the edit view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  console.log("It got to check update Data")
  console.log("Body in check inv rules", req.body)
  let classificationList = await utilities.buildClassificationList();
  const errors = validationResult(req); // Check for validation errors
  
  if (!errors.isEmpty()) {
    // If there are errors, render the add-inventory page with error messages
    let nav = await utilities.getNav();
    const locals = req.body; // Retain form data so the user doesn't lose their input
    const inv_id = req.body.inv_id; 

    console.log("Paul ", locals)

    res.render("inventory/management", {
      title: "Edit Inventory View",
      nav,
      errors, // Display errors
      locals, // Retain input values
      classificationList, 
      inv_id
    });
    return; // Stop further processing
  }
  
  next(); // If no validation errors, proceed to the next middleware
};

module.exports = validate;
