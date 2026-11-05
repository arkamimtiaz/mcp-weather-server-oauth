const db = require("../configdb");

const registermodel = (name, email, hashpassword, callback) => {
    const sql = "INSERT INTO register (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, hashpassword, "user"], callback)
}


module.exports = { registermodel };