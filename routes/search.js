const exp = require('express');
const router = exp.Router();
const {querySearch}= require("../controllers/searchController");

router.get("", querySearch);

module.exports = router;

