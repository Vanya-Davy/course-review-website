const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  username: {
    required: true,
    minLength: 3,
    maxLength: 10
  },
  email: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 100
  },
  password: {
    type: String,
    minLength: 6,
    maxLength: 1024
  },
  date: {
    type: Date,
    default: Date.now
  }
})

// userSchema.method=function(){}

userSchema.pre('save', async function (next) {
  if(this.isModified('password') || this.isNew){
    const hash = await bcrypt.hash(this.password,10),
    this.password=hash,
    next()
  }else{
    return next()
  }
})

userSchema.methods.comparePassword=function(password,callback){
  bcrypt.compare(password,this.password,(err,isMatch)=>{
    if(err){
      return callback(err,isMatch)
    }
    callback(null,isMatch)
  })
}

module.exports=mongoose.model('User',userSchema)
