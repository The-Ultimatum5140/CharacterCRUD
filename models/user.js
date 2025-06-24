const mongoose=require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/test-app")

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    url:String
})
module.exports=mongoose.model('user',userSchema)