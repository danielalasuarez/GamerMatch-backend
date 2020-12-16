import express from 'express'
var router = express.Router();
// const router = require("express").Router();
// const router = express().Router();
// router.use(auth);
// export default router = Router()

router.get("/", (req,res) => {
    res.send("This is working");
    console.log("router working") //only works on local backend for no on /profile/test
})
export default router;