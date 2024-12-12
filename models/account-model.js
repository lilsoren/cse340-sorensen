const pool = require("../database/index")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using account id
* ***************************** */
async function getAccountById (id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* ***************************
 *  Update Account Data
 * ************************** */
async function updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email, 
) {

  try {
    const sql =
      "UPDATE public.account SET account_email = $4, account_firstname = $2, account_lastname = $3 WHERE account_id = $1 RETURNING *"
    const data = await pool.query(sql, [
      account_id,
      account_firstname,
      account_lastname,
      account_email, 
    ])
    return data.rows[0]
  } catch (error) {
    console.error("account error: " + error)
  }
}

/* ***************************
 *  Update Password Data
 * ************************** */
async function updateAccountPassword(account_id, account_password) {
  try {
    const sql =
      "UPDATE public.account SET account_password = $2 WHERE account_id = $1 RETURNING *";
    return await pool.query(sql, [account_id, account_password]);
    //return data.rows[0];
  } catch (error) {
    console.error("account error: " + error);
    //return null;
  }
}


module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, updateAccountPassword}