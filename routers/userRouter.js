import express from 'express'
var router = express.Router();
import Cards from '../models/dbCards.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import auth from '../middleware/auth.js'

//==============================================================================
// POST ROUTES TO REGISTER AND LOG IN
//==============================================================================


// router.get("/", (req,res) => {
//     res.send("This is working");
//     console.log("router working") //only works on local backend for now on /profile
// })



//==============================================================================
// REGISTER POST ROUTE (CREATE PROFILE WHICH WILL APPEAR ON CARD)
//==============================================================================
//async so we can save to mongodb
router.post("/register", async (req, res) =>{
    // res.send("working bb") //this route /profile/register is working but the below code only works if res.send is commented out
    //res.send automatically stops the below code from running!
    try{
        //had to use array because I had it in an array on postman.. it works without the array see below code 
// const{name, email, password, imgUrl, killDeathRatio, gameHighlights} = req.body[0]; // this will create 6 variables with all of the values stored in the db 
// console.log(req.body[0].name)
let {name, email, password, imgUrl, killDeathRatio, gameHighlights} = req.body; //chnaged to let because if not it will throw an error when you dont add the variables that are not required 
console.log(name)
//validate if the user submitted a name email and password because they cant move forward without
if(!name || !email || !password) 
return res.status(400).json({msg: "You have to add your GamerTag, Email, and Password to create an account!"});

const existingUser = await Cards.findOne({email: email}) //look in data base and see if the email there matches the email variable we have here on line 22
// console.log(existingUser)
//needs to be findOne not find because if not it will look through all of the vars
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
//works when you changed the object with all the variables from const to let 
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
res.json(savedUser) //sending saved user to the front
} catch (err) { //if the try block fails then we send 500 error and we send it to the front end in case we need it 
        res.status(500).json({error: err.message});
    }
})


//==============================================================================
// LOGIN POST ROUTE (SESSION)
//==============================================================================

router.post("/login", async (req,res) => {
    try {
let {email, password} = req.body; //same thing as above but to login we only need email & pword

//validate
if (!email || !password)
return res.status(400).json({msg: "Not all fields have been entered!"});

//validate if the password inputted belongs to the account with this email
 const user = await Cards.findOne({email: email});
if(!user) // if user doesnt exist
return res.status(400).json({msg: "There is no account registered with this email, please register!"});

//make sure passwords match 
//comparing bcrypt hashed pword to the password in the req.body 
const pwordMatch = await bcrypt.compare(password, user.password)
if (!pwordMatch)
    return res.status(400).json({msg: "Invalid credentials"});

    //if the above if statement didnt trigger then ..
    //we use the _id that mongo gives us when we post to the db 
    //each id is associated with each user and is a point to which use has been logged in
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET); // jwt stores whihc user has been logged in
    res.json({ //sending some info about this user to the front end (we get this from when they registered)
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    })    //the token the jwot returns an ancoded piece of code that stores the validation for log in 


    }catch (err) { //if the try block fails then we send 500 error and we send it to the front end in case we need it 
        res.status(500).json({error: err.message});
    }
})

//==============================================================================
// DELETE ROUTE this will allow you to delete your account 
//==============================================================================
//this function will only run once JWOT is validated and the user is logged in
//pass auth middleware as a second param 
router.delete("/delete", auth, async (req,res) => {
// console.log(req.user); //worked the delete now recongnizes the user 
try {

const deletedUser = await Cards.findByIdAndDelete(req.user); //gets the id we got from the jwot finds it in the db and deltes the id 
res.json(deletedUser); //send to front end 

} catch (err) { //if the try block fails then we send 500 error and we send it to the front end in case we need it 
    res.status(500).json({error: err.message});
}
});

//==============================================================================
// route that will say true or false if token is valid 
//==============================================================================
//same as auth middleware but will only say true or false wont return all of the errors we have set up in auth
//will allow us to tell the front end if you are logged in or not 
 router.post("/tokenIsValid", async (req, res) => {
    try{
        const token = req.header("ex-auth-token"); //get&stores token 
        if(!token) return res.json(false); //if not token return false 

        //verify jwt
        const verified = jwt.verify(token,process.env.JWT_SECRET)
        if(!verified) return res.json(false) // if the token hasnt been verified return false 

        //verify that user exist in db 
        const user = await Cards.findById(verified.id);
        if(!user) return res.json(false) //if the user is not found in db then return false 

        else return res.json(true);
    } catch (err) { //if the try block fails then we send 500 error and we send it to the front end in case we need it 
        res.status(500).json({error: err.message});
    }
 })

export default router;

