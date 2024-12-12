const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  // console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '<hr />'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle view HTML
* ************************************ */
Util.buildVehicleGrid = async function(data){
  let grid = ''
  let v = data[0]
  if(data.length > 0){
    // grid = '<div id="vehicle-display">'
      grid +=  '<a href="../../inv/detail/'+ v.inv_id 
      + '" title="View ' + v.inv_make + ' '+ v.inv_model 
      + 'details"><img src="' + v.inv_image 
      +'" alt="Image of '+ v.inv_make + ' ' + v.inv_model +' on CSE Motors" /></a>'
      grid += '<h2>' + v.inv_make + " " + v.inv_model + ' Details</h2>'
      grid += '<br />'
      grid += '<span><b>Price: $' + new Intl.NumberFormat('en-US').format(v.inv_price) + '</b></span>'
      // grid += '<h2>'
      grid += '<br />'
      grid += '<span><b>Description:</b> ' + v.inv_description + '</span>' 
      grid += '<br />'
      grid += '<span><b>Color:</b> ' + v.inv_color + '</span>'   
      grid += '<br />'
      grid += '<span><b>Miles:</b> ' + new Intl.NumberFormat('en-US').format(v.inv_miles) + '</span>'    
      // grid += '</h2>'
  //  grid += // grid += '</div>'
    // grid += '    <form id= "updateForm" action="/inv/details/review" method="POST">'
    // grid += '<lable for="review_text">add a review</lable><br>'
    // grid += '<input type="text" name="review_text"'
    // grid +=' name=""'
    // grid +=' required'
    // grid +=' placeholder="Enter review here"'
    // //grid += 'value="<%= locals.review_text%>"'

    // grid +=' >'

    // // submit button
    // grid += '<button disabled type="submit">Submit Review</button>'
    // grid += '<input type="hidden" name="vehicle_id"  <% if(locals.account_id) { %> value="<%= locals.account_id %>"<% } %>'
    // grid += '</form>'    
    // grid +='<script src="/js/inv-update.js"></script>'

  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ***************************
 *  Build clasification select list
 * ************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="inventoryClass" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  // console.log("Classification List" , classificationList)
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
* Middleware to Check Account Type
**************************************** */
Util.checkAccountType = (req, res, next) => {
  if (req.cookies.jwt) {
    const userInfo = jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET)
    const userType = userInfo.account_type
    if (userType == "Employee" || userType == "Admin") {
      return next()
    } else {
      req.flash("notice", "Must be an employee or admin to access administrative permissions.")
      return res.redirect("/account/login")
    }
  } else {
    return res.redirect("/account/login")
  }
 }

Util.buildReviewList = async function (reviews) {
  let html = ""
  for (let i = 0; i < reviews.length; i++) {
       html += `<p><strong>${reviews[i].review_text}:</strong> ${reviews[i].account_firstname} ${reviews[i].account_lastname}</p>`
     }
     return html
}

module.exports = Util

/*****************************************
* Middleware For Handling Errors
* Wrap other functions in this for
* General Error Handling
****************************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);



