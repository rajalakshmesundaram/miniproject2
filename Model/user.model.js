import mongoose from "mongoose";
const userSchema=mongoose.Schema({
    FirstName:String,
    LastName:String,
    UserName:String,
    password:String,
    token:String
})
const user = mongoose.model('user',userSchema)
export default user