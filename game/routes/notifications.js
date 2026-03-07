const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/count", auth, async (req,res)=>{
try{

res.json({
count:0
});

}catch(err){

res.status(500).json({
message:"Serverfehler"
});

}
});

module.exports = router;