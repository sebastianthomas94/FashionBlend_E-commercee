const mongoose=require("mongoose");
const schema= mongoose.Schema;

const userSchema=new schema({

    name: String,
    phone: Number,
    email: String,
    gender: String,
    dob: Date,
    address:[
        {
            name: String,
            address: String,
            pin: Number
        },
    ],
    online: Boolean,
    ban: Boolean 

});

const userModel = mongoose.model("user", userSchema);
module.exports=userModel;