const { body, validationResult } = require("express-validator");
const utilities = require("../utilities/");
const validate = {}

/* **********************************
*  Classification Name Validation Rules
* ********************************* */
validate.classificationRules = () => {
  return [
    // classificationName is required and must contain only alphanumeric characters
    body("classificationName")
      .trim()
      .notEmpty()
      .withMessage("Classification name is required.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters."),
  ];
};

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classificationName } = req.body;
  // let errors = [];
  errors = validationResult(req); // Check for validation errors
  
  if (!errors.isEmpty()) {

    // If there are errors, return to the form with error messages
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors, // Display errors on the page
      title: "Add New Classification",
      nav,
      locals: { classificationName } // Retain input value on error
    });
    return;
  }
  next(); // If no errors, proceed to the next middleware
};

module.exports = validate;
