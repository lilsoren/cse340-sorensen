const invModel = require("../models/inventory-model")
const Util = {}


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
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
  let grid
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
    // grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

module.exports = Util

/*****************************************
* Middleware For Handling Errors
* Wrap other functions in this for
* General Error Handling
****************************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);



