const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get vehicle details 
 * ************************** */
async function getVehicleById(vehicle_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [vehicle_id]
    )
    return data.rows
  } catch (error) {
    console.error("getvehiclebyid error " + error)
  }
}

/* ***************************
 *  Add a new classification
 * ************************** */
async function addClassification(classificationName) {
  // Ensure that the classification name does not contain spaces or special characters
  const regex = /^[a-zA-Z0-9]+$/;
  if (!regex.test(classificationName)) {
    throw new Error("Classification name cannot contain spaces or special characters.");
  }

  try {
    // Insert the new classification into the database
    const result = await pool.query(
      `INSERT INTO public.classification (classification_name) 
      VALUES ($1) RETURNING *`,
      [classificationName]
    );
    // Returning the inserted classification (you can use this if needed)
    return result.rows[0];
  } catch (error) {
    console.error("addClassification error " + error);
    throw error;  // Re-throw the error to handle it in the controller
  }
}

/* ***************************
 *  Add a new inventory item
 * ************************** */
async function addInventory(car) {
  try {
    // Insert the new inventory item into the database
    const result = await pool.query(
      `INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 ) RETURNING *`,
      [car.classification, car.make, car.model, car.image, car.thumbnail, car.price, car.year, car.miles, car.color]
    );
    // Returning the inserted inventory item (you can use this if needed)
    return result.rows[0];
  } catch (error) {
    console.error("addInventory error " + error);
    throw error;  // Re-throw the error to handle it in the controller
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory};
