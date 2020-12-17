import express from 'express'
var router = express.Router();
import Cards from '../models/dbCards.js'
import bcrypt from 'bcryptjs';
// const router = require("express").Router();
// const router = express().Router();
// router.use(auth);
// export default router = Router()

// router.get("/", (req,res) => {
//     res.send("This is working");
//     console.log("router working") //only works on local backend for now on /profile
// })

//asyn so we can save to mongodb
router.post("/register", async (req, res) =>{
    // res.send("working bb") //this route /profile/register is working but the below code only works if res.send is commented out
    //res.send automatically stops the below code from running!
    try{
// const{name, email, password, imgUrl, killDeathRatio, gameHighlights} = req.body[0]; // this will create 6 variables with all of the values stored in the db 
// console.log(req.body[0].name)
const{name, email, password, imgUrl, killDeathRatio, gameHighlights} = req.body;
console.log(name)
//validate if the user submitted a name email and password because they cant move forward without
if(!name || !email || !password) 
return res.status(400).json({msg: "You have to add your GamerTag, Email, and Password to create an account!"});

const existingUser = await Cards.findOne({email: email}) //look in data base and see if the email there matches the email variable we have here on line 22
// console.log(existingUser)
//await is for us to wait to see if mongo finds the user 
//if it finds one it will store it in existingUser if not it will be null 
if (existingUser) 
return res.status(400).json({msg: "An account with this email is already in use"});
//if (existingUser) stays null then we can continue

const existingName = await Cards.findOne({name: name}) //look in data base and see if the name there matches the name variable we have here on line 22
// console.log(existingName)
//await is for us to wait to see if mongo finds the user 
//if it finds one it will store it in existingName if not it will be null 
if (existingName) 
return res.status(400).json({msg: "An account with this name is already in use"});
//if (existingName) stays null then we can continue

//if the unrequired parts are not filled then we will put temporary things in their place
if (!imgUrl) imgUrl = "This Gamer hasn't added a picture";
if (!killDeathRatio) killDeathRatio = "This Gamer hasn't added thier KDR";
if (!gameHighlights) gameHighlights = "Game Highlights unavailable at this time";

//hash pword
const salt = await bcrypt.genSalt();
const passwordHash = await bcrypt.hash(password, salt) //will return hashed pword 
console.log(passwordHash)

//new model... everything stays the same except the password will now be hashed
const newUser = new Cards({
    name,
    email,
    password: passwordHash,
    imgUrl,
    killDeathRatio,
    gameHighlights
});
//below function will save the const NewUser to the DB
//we use await bc save()is an async operation
const savedUser = await newUser.save()
res.json(savedUser) //sending saved user to the front end
} catch (err) { //if the try block fails then we send 500 error and we send it to the front end in case we need it 
        res.status(500).json(err);
    }
})
export default router;

