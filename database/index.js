const { Pool } = require('pg');
require("dotenv").config()
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
const pool = new Pool({    
  connectionString: process.env.DB_URL,    
  ssl: false
});

if (process.env.NODE_ENV.toLowerCase().includes('dev')) {    
  /**     * Instead of giving the user the original pool object, we can create a     * wrapper that allows us to control what actions the user can take on the     * pool. In this case, we only want the user to be able to query the pool     * and we want to automatically log all queries that are executed.     */    
  module.exports = {        
    async query(text, params) {            
      try {                
        const res = await pool.query(text, params);                
        console.log('Executed query:', { text });                
        return res;            
    } catch (error) {                
        console.error('Error in query:', { text });                
        throw error;            
    }        
  }    
};
} else {    // We are in production, so we can just export the pool object directly.    
  module.exports = pool;
}