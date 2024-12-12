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
  const vehicle_id = parseInt(req.params.vehicleId)
  console.log(vehicle_id)
  const data = await invModel.getVehicleById(vehicle_id)
  const grid = await utilities.buildVehicleGrid(data)
   //const reviews = await invCont.buildReviewList(vehicle_id)
  const reviewsList = await invModel.getReviewByVehicleId(vehicle_id)
  const reviews = await utilities.buildReviewList(reviewsList)

  let nav = await utilities.getNav()
  const vehicleName = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
  res.render("./inventory/vehicle", {
    title: vehicleName,
    nav,
    grid,
    reviews,
    vehicle_id,       
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
  let classificationList = await utilities.buildClassificationList();
  res.render("inventory/edit-inventory", {
    title: "Add New Vehicle",
    nav,
    errors: null,
    classificationList 

  });
};

/* Add a New Car to Inventory */
invCont.addInventory = async function (req, res, next) {
  let classificationList = await utilities.buildClassificationList();
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
      classificationList
    };
    // Insert the new classification into the database
    await invModel.addInventory(newInventory);

    // Flash success message and redirect to inventory management view
    req.flash("success", "New car successfully added to inventory!");
    res.redirect("/inv/management"); // Corrected route to management
  } catch (error) {
    // If insertion fails, flash the error and redirect back to the add classification page
    req.flash("errors", "Failed to add car: " + error.message);
    res.redirect("/inv/edit-inventory"); // Redirect back to form
    // res.status(501).render("inventory/add-inventory", {
    //   title: "Add New Vehicle",
    //   nav,
    //   classificationList,
    // }); // Corrected route to add classification
  }
};

/* ***************************
 *  Build Management View
 * ************************** */
invCont.showManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav(); 
    const classificationList = await utilities.buildClassificationList()
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationList,
      message: req.flash("message"), 
    });
  } catch (error) {
    console.error("Error rendering management view:", error);
    next(error); // Pass the error to the error handler
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build Edit Inventory View
 * ************************** */
 invCont.editInventoryView = async function (req, res, next) {
   const inv_id = parseInt(req.params.inv_id)
   let nav = await utilities.getNav();
   const itemData = (await invModel.getVehicleById(inv_id))[0]
   const classificationList = await utilities.buildClassificationList(itemData.classification_id)
   const itemName = `${itemData.inv_make} ${itemData.inv_model}`
   res.render("./inventory/edit-inventory", {
     title: "Edit " + itemName,
     nav,
     classificationList: classificationList,
     errors: null,
     inv_id: itemData.inv_id,
     inv_make: itemData.inv_make,
     inv_model: itemData.inv_model,
     inv_year: itemData.inv_year,
     inv_description: itemData.inv_description,
     inv_image: itemData.inv_image,
     inv_thumbnail: itemData.inv_thumbnail,
     inv_price: itemData.inv_price,
     inv_miles: itemData.inv_miles,
     inv_color: itemData.inv_color,
     classification_id: itemData.classification_id
   });
 };

/* ***************************
 *  Process Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inventoryModel,
    inventoryImg,
    inventoryThum,
    inventoryPrice,
    inventoryYear,
    inventoryMiles,
    inventoryColor,
    inventoryClass,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inventoryModel,
    inventoryImg,
    inventoryThum,
    inventoryPrice,
    inventoryYear,
    inventoryMiles,
    inventoryColor,
    inventoryClass,
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inventoryModel
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const classificationList = await utilities.buildClassificationList(inventoryClass)
    const itemName = `${inv_make} ${inventoryModel}`
    req.flash("notice", "Sorry, the modification failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id,
    inv_make,
    inventoryModel,
    inventoryImg,
    inventoryThum,
    inventoryPrice,
    inventoryYear,
    inventoryMiles,
    inventoryColor,
    inventoryClass,
    })
  }
}

/* ***************************
 *  Build Delete Inventory View
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav();
  const itemData = (await invModel.getVehicleById(inv_id))[0]
  //const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
  });
};

/* ***************************
 *  Process Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {inv_id} = req.body
  const updateResult = await invModel.deleteInventory(inv_id)

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inventoryModel
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/management")
  } else {
    //const classificationList = await utilities.buildClassificationList(inventoryClass)
    const itemName = `${inv_make} ${inventoryModel}`
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id
    })
  }
}

/* ***************************
 *  Build vehicle details page
 * ************************** */
// invCont.buildReviewList = async function (req, res, next) {
//   const data = await invModel.getReviewByVehicleId(vehicle_id)
//   let html = ""
//   for (let i = 0; i < data.length; i++) {
//     console.log("html is", html)
//     html += `<p><strong>${data[i].review_text}:</strong> ${data[i].account_firstname} ${data[i].account_lastname}</p>`
//   }
  
//   return html
// }

/* ***************************
 *  Add a review form
 * ************************** */
// invCont.addReview = async function (req, res, next) {
//   const { review_text, account_firstname, account_lastname } = req.body;
//   try {
//     const review = {
//       review: review_text,
//       firstName: account_firstname,
//       localStorageName: account_lastname
//     };
//     // Assuming the validation happens in middleware now
//     await invModel.addReview(review); 
//     req.flash("success", "Your review has been recorded!");
//     res.redirect("/inv/detail/:vehicleId"); 
//   } catch (error) {
//     req.flash("errors", "Failed to add review: " + error.message);
//     res.redirect("/inv/detail/:vehicleId"); 
//   }
// };

invCont.addReview = async function (req, res, next) {
  console.log(req.session.user)
  const account_id = req.session.user.account_id
  const account_firstname = req.session.user.account_firstname
  const account_lastname = req.session.user.account_lastname

  const { vehicle_id, review_text, created_at} = req.body;
  // vehicle_id = parseInt(vehicle_id);
  console.log("req.body", req.body)
  console.log("id", vehicle_id)
  if (!review_text){
    console.log("error at add Review")
    req.flash("errors", "review_text and created_at fields are required");
    return res.redirect(`/inv/detail/${vehicle_id}`);
  }

  try {
    const success = await invModel.addReview(
      vehicle_id,
      account_id,
      review_text,
      //created_at: created_at,  // assuming the format is 'YYYY-MM-DD HH:MM:SS'
    );

    if (success){
      req.flash("success", "Your review has been recorded!");
    }
    else{
      req.flash("errors", "Failed to add review.");
    }
    res.redirect(`/inv/detail/${vehicle_id}`); 
  } catch (error) {
    console.error("Error adding review:", error);
    req.flash("errors", "Failed to add review: " + error.message);
    res.redirect(`/inv/detail/${vehicle_id}`); 
  }
};

module.exports = invCont 