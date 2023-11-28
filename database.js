var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')
var scripts = require("./migration/init")
const DBSOURCE = "db.sqlite"



let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    } 
    console.log('Connected to the SQLite database.')
    db.run(scripts.createUsersTable, (err) => {
        const { ADMIN_USER, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
        // If no errors insert admin record into table
        if (!err) {
            db.run(scripts.insertAdminRecord, [ADMIN_USER, ADMIN_EMAIL, md5(ADMIN_PASSWORD)], (err) => {
                console.log(err)
            })
        }
    });  
    
});


module.exports = db