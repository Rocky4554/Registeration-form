require("dotenv").config();
const express = require ('express');
const app = express();
require("./database/conn");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt =require("jsonwebtoken");

const port = process.env.PORT || 3000;
const dirname = path.join(__dirname, "./public");
const template_path = path.join(__dirname, "./templates/views");
const partial_path = path.join(__dirname, "./templates/partials");
const Register = require("./models/registers");// requiring our schema
// console.log(path.join(__dirname,"../public"));
app.use(express.static(dirname));
app.set("view engine","hbs");
app.set("views",template_path);
app.use(express.json());
app.use(express.urlencoded({extended:false})); 
// hbs.registerPartials(partial_path);

console.log(process.env.Secret_key);

app.get("/",(req,res)=>{
    //res.send("Hello form server side.")
    res.render("index");
});

app.get("/register",(req,res)=>{
     res.render("register");
})

app.post("/register", async (req,res)=>{
    try{
        // console.log(req.body.name);
        // res.send(req.body.name);

        const indata = new Register({
            name:req.body.name,   
            email:req.body.email,
            position:req.body.position,
            password:req.body.password,
            gender:req.body.gender
        })
        //generating web tokens
        console.log("the success part" + indata);
        
        const token = await indata.generateauthToken();

        console.log("the token part" + token);
   
        // hashing our password before saving it our database use pre method in schema model


        const registered = await indata.save();
        res.status(201).render("index");

    }catch (error){
        res.status(400).send(error);
    }
})

app.get("/login",(req,res)=>{
    res.render("login");
})
// checking whether email is valid or not
app.post("/login", async(req,res) =>{
    try{

        const email = req.body.email;
        const password = req.body.password;
        const userdata = await Register.findOne({email:email});// checking without hashing
        // res.send(data);
        // console.log(data);
        // console.log(`${email} and ${password}`);

        const isMatching = bcrypt.compare(password,userdata.password);
        // if(userdata.password === ppassword){
          
        // generating token for login 
            const token = await userdata.generateauthToken();
            console.log("the token part" + token);

            if(isMatching){
            res.status(201).render("index");
        }
        else{
            res.send("invalid");
        }

    }catch(error){
        res.status(400).send("Email or Password is incorrect");
    }
})

app.listen(port,()=>{
    console.log(`server is running on port no. ${port} `);

});