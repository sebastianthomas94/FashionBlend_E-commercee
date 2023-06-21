const exp = require('express');
const router = exp.Router();
const {productsPageGet,productsGet}= require("../controllers/productsController");

router.get("/page/:pageNo", productsGet);

router.get("/:id", productsPageGet);




module.exports = router;