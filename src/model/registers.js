const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const employeeShema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    phone: {
        type: Number,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    cpassword: {
        type: String,
        require: true
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
})

employeeShema.methods.genetoken = async function () {
    try {
        token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
        // console.log(token);
        this.tokens= this.tokens.concat({token:token})
        await this.save()
    } catch (err) {
        res.send("error is " + err)
    }
}

// if(this.isModify("password")){
// upper line when create modify password then it reload only paasword that's why 
employeeShema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 10)
    this.cpassword = await bcrypt.hash(this.password, 10)
    // upper line this.cpassword we not need in database so undefined
    // }
    next();
})

const Register = new mongoose.model("Register", employeeShema)
// Register first must be capital and sigular then in database it will create plural

module.exports = Register;