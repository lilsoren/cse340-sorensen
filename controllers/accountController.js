const bcrypt = require("bcryptjs");
const utilities = require('../utilities/index');
const accountModel = require('../models/account-model');
const jwt = require("jsonwebtoken");
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  }

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  console.log("Register")
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}
  
/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { email, psw } = req.body
  const accountData = await accountModel.getAccountByEmail(email)

  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    email,
   })
  //return
  }
  try {
   if (await bcrypt.compare(psw, accountData.account_password)) {
   delete accountData.account_password

   req.session.user = accountData


   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }

   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

/* ****************************************
*  Deliver successful login view
* *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()

  // Make sure the user is logged in (check session or JWT token)
  if (!req.session.user) {

    // Redirect to login if user is not logged in
    return res.redirect('/account/login') 
  }
  
  const firstName = req.session.user.account_firstname
  const accountType = req.session.user.account_type;
  const id = req.session.user.account_id

  res.render("account/info", {
    title: "Info",
    nav,
    errors: null,
    firstName,
    id,
    accountType
  })
}

/* ****************************************
*  Deliver Update Account View
* *************************************** */
async function buildUpdate(req, res, next) {
  const id = req.params.id
  let nav = await utilities.getNav()
  const accountInfo = await accountModel.getAccountById(id)
  res.render("./account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_id: id,
    account_firstname: accountInfo.account_firstname,
    account_lastname: accountInfo.account_lastname,
    account_email: accountInfo.account_email, 
    account_password: accountInfo.account_password
  })
}
/* ***************************
 *  Process Update Account Data
 * ************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  )

  if (updateResult) {
    // const itemName = updateResult.account_firstname + " " + updateResult.account_lastname
    req.flash("notice", `Your account was successfully updated.`)
    res.redirect("/account")
  } else {
    //const classificationList = await utilities.buildClassificationList(inventoryClass)
    // const itemName = `${account_firstname} ${account_lastname}`
    req.flash("notice", "Sorry, the modification failed.")
    res.status(501).render("/account", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    })
  }
}

/* ***************************
 *  Process Update Account Password
 * ************************** */
async function updateAccountPassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_password} = req.body

  // // Step 1: Validate the password (ensure they match)
  // if (account_password !== confirm_password) {
  //   req.flash("notice", "Passwords do not match.");
  //   return res.status(400).render("account/update", {
  //     title: "Update Account",
  //     nav,
  //     errors: null,
  //     account_id,
  //     account_password,
  //   });
  // }

  // Step 2: Ensure the password meets the required strength (length, special characters, etc.)
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/;
  if (!passwordRegex.test(account_password)) {
    req.flash("notice", "Password must be at least 12 characters, with at least 1 number, 1 capital letter, and 1 special character.");
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_password,
    });
  }

  // Step 3: Hash the new password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(account_password, 10); // Hash the password
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the password update.");
    return res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_password,
    });
  }

  // Step 4: Update the password in the database
  const updateResult = await accountModel.updateAccountPassword(account_id, hashedPassword)

  // Step 5: Check if the update was successful
  if (updateResult) {
    req.flash("notice", `Your password was successfully updated.`)
    res.redirect("/account")
  } else {
    req.flash("notice", "Sorry, the modification failed.")
    res.status(501).render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id,
    account_password
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccount, buildUpdate, updateAccount, updateAccountPassword }
