const db = require("../configdb");
const authorizationController = (req, res) => {
    const client_id = req.query.client_id;
    const redirect_uris = req.query.redirect_uri;
    const allowed_scopes = req.query.scope; 
    const response_type = req.query.response_type; 
    const state = req.query.state;  
    const code_challenge = req.query.code_challenge;
    const code_challenge_method = req.query.code_challenge_method
    if (!client_id || !redirect_uris ) {
        return res.status(400).json("client_id and redirect_uri are required")}
    const sql = "SELECT client_id, redirect_uris, allowed_scopes FROM oauth_clients WHERE client_id = ?";
    db.query(sql, [client_id], (err, result) => { 
        if(err) {
            return res.status(400).json("error")
        }
        if(result.length <= 0) {
            return res.status(400).json("sorry have not client")
        }

        const registeruris = result[0].redirect_uris;
        const uris = Array.isArray(registeruris)
        ? registeruris
        : JSON.parse(registeruris);
        if(!uris.includes(redirect_uris)) {
            return res.status(400).json("invalid uris")
        }

        const registerscopes = result[0].allowed_scopes;
        const final_scopes = Array.isArray(registerscopes)
        ? registerscopes
        : JSON.parse(registerscopes)
        if(!final_scopes.includes(allowed_scopes)) {
            return res.status(400).json("invalid scope")
        }

        if(response_type !== "code") {
            return res.status(400).json("your response type is not valid")
        } 
        if(!code_challenge || !code_challenge_method) {
            return res.status(400).json("code_challange and code_challenge_method is required!")
        }
        
        if(code_challenge_method !== "S256") {
            return res.status(400).json("method is not correct")
        }
        req.session.oauth = {
           client_id,
           redirect_uri: redirect_uris,
           scope: allowed_scopes,
           state,
           code_challenge,
           code_challenge_method
        };        
        req.session.save((err) => {
          if (err) {
              return res.status(500).json({message: "Session save failed"});
           }
           return res.status(200).redirect("http://localhost:5173/"); 
        });
      })

}
module.exports = { authorizationController }




// E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstuX0A