const mongoose=require("mongoose");
const schema= mongoose.Schema;

const productSchema=new schema({

    name: String,
    price: Number,
    categories: [String],
    size: String,
    img: [String],
    moreInfo: {
        brand: String,
        description: String,
        material: String,
        discount: Number,
        rating: Number
    }


});

const productModel = mongoose.model("product", productSchema);
module.exports=productModel;