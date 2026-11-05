const bcrypt = require("bcrypt");
const db = require("../configdb");
const crypto = require("crypto");
const loginController = async (req, res) => {
    const {email, password} = req.body;
    const sql = "SELECT * FROM register WHERE email = ?"
    db.query(sql, [email], async (err, result) => {

        if (err) {
            return res.status(400).json({message : "error"})
        }
        if (result.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }        
        const user = result[0]
        const check = await bcrypt.compare(password, user.password)
        if(!check) {
            return res.status(400).json("password is not correct!")
        }
        req.session.user = {
            id: user.id,
            role: user.role
        };

    req.session.save((err) => {
        if(err) {
            return res.status(400).json("session save fail")
        }
        if(req.session.oauth) {
            const authorization_code = crypto.randomBytes(32).toString("base64url")
            const code_hash = crypto.createHash("sha256").update(authorization_code).digest("hex"); 
            const client_id = req.session.oauth.client_id;
            const user_id = req.session.user.id;
            const redirect_uri = req.session.oauth.redirect_uri;
            const scope = req.session.oauth.scope;
            const code_challenge = req.session.oauth.code_challenge;
            const code_challenge_method = req.session.oauth.code_challenge_method;
            const expires_at = new Date(Date.now() + 5 * 60 * 1000)
            const sql = "INSERT INTO oauth_codes (code_hash, client_id, user_id, redirect_uri, scope, code_challenge, code_challenge_method, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            return db.query(sql, [code_hash, client_id,  user_id, redirect_uri, scope, code_challenge, code_challenge_method, expires_at], (err, result) => {
                if(err) {
                    return res.status(400).json(err)
                }
                const params = new URLSearchParams({
                    code : authorization_code,
                    state : req.session.oauth.state
                })
                const callbackUrl = new URL(redirect_uri);
                callbackUrl.search = params.toString();
                return res.redirect(callbackUrl.toString())
            })  
        }
        return res.status(200).json({
            message: "Login successfully!"
        })
    })
    })
    
}

module.exports = { loginController }










// return res.status(200).json(result)

