const crypto = require("crypto");
const db = require("../configdb");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const tokenController = (req, res) => {
const {grant_type, code, redirect_uri, client_id, code_verifier} = req.body;

    if(grant_type !== "authorization_code") {
        return res.status(400).json("grant_type is not valid!")
    }
    if(!code || !code_verifier) {
        return res.status(400).json("invalid request")
    }
    const authorization_hashcode = crypto.createHash("sha256").update(code).digest("hex");
    const hash_codeverifier = crypto.createHash("sha256").update(code_verifier).digest("base64url")
    const sql = "SELECT code_hash, redirect_uri, client_id, user_id, code_challenge, used, expires_at, scope FROM oauth_codes WHERE code_hash = ?";
    db.query(sql, [authorization_hashcode], async (err, result) => {
        if(err) {
            return res.status(400).json(err)
        }
        const data = result[0]
        if(!data) {
            return res.json("invalid_grant")
        }
        if(data.used) {
            return res.status(400).json("code may be used!!!")
        }
        if(new Date(data.expires_at) <= new Date()) {
            return res.status(400).json("Authorization code has expired")
        }
        if(redirect_uri !== data.redirect_uri) {
            return res.status(400).json("redirect-uri is not valid")
        }
        if(client_id  !== data.client_id) {
            return res.status(400).json("client_id is not valid")
        }        
        if(hash_codeverifier !== data.code_challenge) {
            return res.status(400).json("Proof Key For Code Exchange(PKCE) is not verified!!!")
        }
        const sql2 = "UPDATE oauth_codes SET used = true WHERE code_hash = ? AND used = false"
        db.query(sql2, [authorization_hashcode], (err, result) => {
            if(err) {
                return res.status(400).json("error")
            }
            if(result.affectedRows === 0) {
                return res.status(400).json({error : "invalid_grant"})
            }
            const sql3 = "SELECT role FROM register WHERE id = ?";
            db.query(sql3, [data.user_id], (err, result) => {
                if(err) {
                    return res.status(400).json("error")
                }
                if(result.length === 0) {
                    return res.status(400).json("invalid grant")
                }
                const userresult = result[0].role
                const payload = {
                   sub: data.user_id,
                   client_id: data.client_id,
                   scope: data.scope,
                   role: userresult
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "5m"});
            return res.json({
                access_token: token,
                token_type: "Bearer",
                expires_in: 300,
                scope: data.scope
            })                
         })
        })
    })
} 

module.exports = { tokenController };





// "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-abcdefghijk"
// http://localhost:3000/api/authorize?response_type=code&client_id=e350d688-82b8-4b26-b589-2a878e7a3d18&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fcallback&scope=weather%3Aread&code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&code_challenge_method=S256&state=test123