var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')
var scripts = require("./migration/init")
const DBSOURCE = "db.sqlite"

const { ADMIN_USER, ADMIN_PASSWORD, ADMIN_EMAIL } = process.env

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.run(scripts.createUsersTable, (err) => {
            if (err) {
                
                console.log("DB has already been initialized", err)
            } else {
                // Table just created insert into table
                db.run(scripts.insertAdminRecord, [ADMIN_USER, ADMIN_EMAIL, md5(ADMIN_PASSWORD)])
            }
        });  
    }
});


module.exports = db