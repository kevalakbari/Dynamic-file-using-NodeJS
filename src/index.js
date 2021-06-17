require('dotenv').config()
const express = require("express")
const path = require("path")
const pug = require("pug")
require("./db/dbconn")
const Register = require("./model/registers")
const bcrypt = require("bcrypt")
// const cookieParser = require("cookie-parser")

const app = express()
const port = process.env.PORT || 8000

const static_path = path.join(__dirname, "../public")
// const templatepath = path.join(__dirname,"../templates")

// for use mongoose output
app.use(express.json())

// in form filld data for see this line... 
app.use(express.urlencoded({ extended: false }))

app.set("view engine", "pug");
// app.use(express.static(static_path))
app.use('/static', express.static('static'))
// app.set("views",templatepath)

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/register", (req, res) => {
    res.render("register")

})


app.post("/register", async (req, res) => {
    try {
        const password = req.body.password
        const confirmpassword = req.body.cpassword
        if (password === confirmpassword) {
            // here triple time equal for also it check data type 
            const regiform = new Register({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                cpassword: req.body.cpassword
                //  this is for get what value user enter 
            })

            const token =await regiform.genetoken()
            res.cookie("jwt",token );
            // , {
            //     expires: new Date(Date.now() + 60000),
            //     httpOnly:true
            // }
           
            // console.log( cookie)


            // here we want hashing is running before save 

            const regi = await regiform.save()
            // upper line promise is run there wait for process then give output

            res.status(201).render("login")

        }
        else {
            res.send(" password are not matching")
        }
    } catch (err) {
        res.status(400).send(err + " same phone nuber and email are not allowed")
    }

})


app.post("/login",async(req,res)=>{
    try{
        email = req.body.email,
        password = req.body.password
        
        // Register.findOne({email:email})  here first email is registe's email already in db and second email is now login email entered. here check both same or not / here we write also  Register.findOne({emaill}) bcoz bothare same name
        const userdetail = await Register.findOne({email:email})
        // here usermail ae find karela aakha email ni badhi value ne represent kare 

        const isMatch = await bcrypt.compare(password,userdetail.password)
        // here automatic bcrypt compare both password same or not

        const token =await userdetail.genetoken()
        // console.log(token)

        res.cookie("jwt",token );
               
        
        if(isMatch){
            res.status(201).render("index")
        }else{
            res.send("invalid login detail")
        }

    }catch(err){
        res.status(400).send(err + "  invalid login detail")
    }
})

app.get("/", (req, res) => {
    res.send("hello from the server")
    console.log("get is connected")
})

app.listen(port, () => {
    console.log(`app is running at ${port}`)
})