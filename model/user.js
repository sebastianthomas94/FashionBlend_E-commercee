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
            building: String,
            street: String,
            city: String,
            state: String,
            pin: Number,
            landmark: String,
            addressType: String,
            default: String,
            phone: Number,
        },
    ],
    online: Boolean,
    ban: Boolean ,
    cart:[{
        id: String,
        numbers: Number,
        size: String
    }],
    orders:[{
        id: String,
        numbers: Number,
        size: String,
        status: String
    }]

});

const userModel = mongoose.model("user", userSchema);
module.exports=userModel;