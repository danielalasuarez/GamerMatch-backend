import jwt from 'jsonwebtoken';

//function that will do the authentication
//not async because we only want to auth the login we dont need to check if user exist in db
const auth = (req, res, next) => { //next is for when auth completed
    try {
    const token = req.header("ex-auth-token"); //stores token 
    if(!token) //if token hasnt been given (if not logged in)
        return res.status(401).json({msg: "No auth token, auth denied"}); //not allowed to move forward to NEXT

    //if is token then verify token 
    const verified = jwt.verify(token, process.env.JWT_SECRET) // this uses token and gives us the decoded jwt 
    //uses token and gives us the original object and matches against JWT_SECRET to see if it has been decoded w our password 
    if(!verified)
    return res.status(401).json({msg: "Token verifivation failed, auth denied"}); 

    //if it is verified
    // console.log(verified) //sends issue too and we only need id 
    req.user = verified.id; //now we have another key in the user called id 
    next(); //function we get from middleware 
    } catch (err) { //if the try block fails then we send 500 error and we send it to the front end in case we need it 
        res.status(500).json({error: err.message});
    }
};

export default auth;
