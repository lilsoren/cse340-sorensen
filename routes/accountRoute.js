const regValidate = require('../utilities/account-validation');
const express = require("express");
const router = new express.Router(); 
const utilities = require("../utilities/index");
const accountController = require("../controllers/accountController");
const { route } = require("./static");


// Define the GET route for the account path
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Process the login attempt
router.post(
    "/login",
    //regValidate.loginRules(),
    //regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// Route to build login view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// New POST route for user registration that handles the registration form submission
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Route to build account view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount))


// Process the account view
router.post(
    "/",
    //regValidate.accountRules(),
    //regValidate.checkAccountData,
    utilities.handleErrors(accountController.processAccount)
)

router.get("/logout", (req, res) => {
    res.clearCookie("jwt")
    res.redirect("/")
})

router.get("/update", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdate))
//router.post("/update", utilities.checkLogin, utilities.handleErrors(accountController.updateAccount))

// Export the router
module.exports = router; 