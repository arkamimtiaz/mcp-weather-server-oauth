const session = require("express-session");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());



app.use(cors({origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.urlencoded({ extended: false }));

app.use(session({secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, 
        sameSite: "lax",
        maxAge: 1000 * 60 * 30
    }
}))

const registerroute = require("./register/registerRoute");
const loginroute = require("./login/loginRoute");
const oauthregisterroute = require("./register/oauthregisterRoute");
const authorization = require("./authorization/authorizeRoute");
const accesstoken = require("./token/tokenRoute");

app.use("/api", registerroute)
app.use("/api", loginroute)
app.use("/api/oauth", oauthregisterroute)
app.use("/api", authorization)
app.use("/api/oauth", accesstoken)

app.get("/.well-known/oauth-authorization-server", (req, res) => {
    return res.json({
        issuer: "http://localhost:3000",
        authorization_endpoint: "http://localhost:3000/api/authorize",
        registration_endpoint: "http://localhost:3000/api/oauth/register",
        token_endpoint: "http://localhost:3000/api/oauth/token",
        response_types_supported: ["code"],
        code_challenge_methods_supported: ["S256"]
    })
})

app.listen(3000, () => {
    console.log("Server running at port 3000");
});