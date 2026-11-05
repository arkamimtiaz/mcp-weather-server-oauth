const crypto = require("crypto")
const { oauthregisterModel } = require("./oauthregisterModel")
const oauthregisterController = (req, res) => {
    console.log("REQUEST BODY:", req.body)
    const { client_name, redirect_uris, scope } = req.body;

    const allowed_scopes =
      typeof scope === "string"
        ? scope.split(" ")
        : [];
        
      if(typeof client_name !== "string" || !client_name.trim() || !Array.isArray(redirect_uris) || redirect_uris.length === 0 || !Array.isArray(allowed_scopes)) {
            return res.status(400).json({
            message: "Invalid or missing client details"
        });
      }

      const client_id = crypto.randomUUID();
      oauthregisterModel(client_id, client_name.trim(), redirect_uris, allowed_scopes, (err, result) => {
            if(err) {
                console.log(err)
                return res.json("error")
            }
            return res.json({
                client_id,
                client_name: client_name.trim(),
                redirect_uris,
                scope: allowed_scopes.join(" ")
            })
      })      
}
module.exports = { oauthregisterController }