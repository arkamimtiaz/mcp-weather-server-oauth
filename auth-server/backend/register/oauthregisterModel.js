const db = require("../configdb");

const oauthregisterModel = (client_id, client_name, redirect_uris, allowed_scopes, callback) => {
    const sql = "INSERT INTO oauth_clients (client_id, client_name, redirect_uris, allowed_scopes) VALUES (?, ?, ?, ?)"
    
    const uris = JSON.stringify(redirect_uris);
    const scope = JSON.stringify(allowed_scopes);

    db.query(sql, [client_id, client_name, uris, scope], callback)  

}

module.exports = { oauthregisterModel }; 