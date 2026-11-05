const bcrypt = require("bcrypt");
const { registermodel } = require("./registerModel");

const registercontroller = async (req, res) => {
    
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
        return res.status(500).json("all fields require")
    }
    
    const hashpassword = await bcrypt.hash(password, 10)
  
    registermodel(name, email, hashpassword, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({message : "internal error"})
        }
        return res.status(200).json({message : "user created!"})
    })
    
}

module.exports = { registercontroller };