const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeschema = new mongoose.Schema({
    name:{
        type:String,
        required:true   
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    position:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }] 
})
// generating authtoken
employeeschema.methods.generateauthToken = async function(){
    try{
        console.log(this._id);
       const token = jwt.sign({_id:this._id.toString()}, "mynameisraunakkumarrockykumarjagrit");
       this.tokens = this.tokens.concat({token:token})
    //    console.log(token);
        await this.save();
       return token;
    } catch(error){
        res.send("the error part" + error);
        console.log("the error part" + error);
    }
}

//middleware generating hashing for our password

employeeschema.pre("save", async function(next){
    if(this.isModified("password")){
    // const hashpassword = await bcrypt.hash(password,10);
    // console.log(`the curent password is ${this.password}`);
    this.password = await bcrypt.hash(this.password,4);
    // console.log(`the curent password is ${this.password}`);

    // this.conformpassword = undefined;// use this to not save your password in cofirm password,
    }

    next(); 
})
// now we need to create collection

const  Register = new mongoose.model("Register",employeeschema);

module.exports = Register;