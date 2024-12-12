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

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {

  console.log("classification_id is ......", classification_id);
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_image = $3, inv_thumbnail = $4, inv_price = $5, inv_year = $6, inv_miles = $7, inv_color = $8, classification_id = $9 WHERE inv_id = $10 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql = "DELETE FROM public.inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [inv_id])
    return data // before this had a [0]  aftr the data so check that if there are errors
  } catch (error) {
    console.error("Delete Inventory Error: " + error)
  }
}

/* ***************************
 *  Get Vehicle Review Data
 * ************************** */
async function getReviewByVehicleId(inv_id){
  try {
    const sql = "SELECT r.*, account_firstname, account_lastname FROM public.review r inner join public.account a on r.account_id = a.account_id  WHERE inv_id = $1 ORDER BY created_at DESC"
    const data = await pool.query(sql, [inv_id])
    return data.rows
  } catch (error) {
    console.error("getReviewByVehicleId error: " + error)
  }
}

/* ***************************
 *  Add Review Data
 * ************************** */
async function addReview(inv_id, account_id, review_text) {
  try {
    // Insert the new review into the database
    const query= `
      INSERT INTO public.review (inv_id, account_id, review_text) 
      VALUES ($1, $2, $3) 
      RETURNING review_id`;

      const values = [inv_id, account_id, review_text]
      const result = await pool.query(query, values);
      console.log("result is ", result.rows[0])
      return result.rows[0];
  } catch (error) {
    console.error("Error adding review " + error);
    throw error;
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory, updateInventory, deleteInventory, getReviewByVehicleId, addReview};
