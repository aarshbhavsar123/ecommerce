import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
     username:{
        type: String,
        required:[true,"Please provide a username"],
        unique:true,
     },
     password:{
        type: String,
        required:true,
     },
     email:{
      type:String,
      required:true,
     },
     isVerified:{
        type:Boolean,
        default:false,
     },
     isAdmin:{
        type:Boolean,
        default:false
     },
     cart:{
      type:mongoose.Schema.Types.ObjectId,
      ref:  "Cart",
     },
     otp:{
      type:String,
      default:"",
     },
     lastOtpReq: { 
         type: String, 
         default: "" ,
     },
     addresses: [{ type: String }],
     forgotPasswordToken:String,
     forgotPasswordTokenExpiry:Date,
     verifyToken : String,
     verifyTokenExpiry:Date
})
const User = mongoose.models.User||mongoose.model("User",userSchema);
export default User;