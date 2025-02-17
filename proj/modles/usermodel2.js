const mongoose = require('mongoose');  
const bcrypt=require('bcrypt')
const crypto=require('crypto')

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
 
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    
    isBlocked:{
        type:Boolean,
        default:false,
    },
 
   
 
    refreshtoken :{
        type:String,
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
},{
    timestamps:true,
});


userSchema.pre("save",async function(next){
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password=await bcrypt.hash(this.password,salt);
    next()
})

userSchema.methods.isPasswordMatched=async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
userSchema.methods.createPasswordResetToken=async function(){
    const resettoken=crypto.randomBytes(32).toString("hex")
  this.passwordResetToken=crypto.createHash('sha256').update(resettoken).digest("hex")
  this.passwordResetExpires=Date.now() + 30 * 60* 1000//10mins
  return resettoken
}




//Export the model
module.exports = mongoose.model('User', userSchema);












//mongo snippets-!mdbgum