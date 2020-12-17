//NOTE: in the package.json we added "type": "module" in order to get ES6 and be able to use import instead of require
//we also added the start script for deployment on heroku
import "dotenv/config.js";
import express from 'express'
import mongoose from 'mongoose'
import Cards from './models/dbCards.js'
import Cors from 'cors'
import userRouter from './routers/userRouter.js'

// Config
const app = express();
const port = process.env.PORT || 8001


//Middleware
app.use(express.json());
app.use(Cors());

//DataBase config // connect to database
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) throw err;
    console.log("MONGODB CONNECTION WORKING")
})


//more middleware
app.use('/profile', userRouter);
//API endpoints

//test route
app.get('/', (req, res) => res.status(200).send('working!!!!'));

//post will push this info into the db 
app.post('/gamers/cards', (req, res) =>{
    const dbCard= req.body;

//handle errors
    Cards.create(dbCard, (err,data) => {
        if(err) {
            //failed
            res.status(500).send(err)
        } else {
            //success 
            res.status(201).send(data)
        }
    })
})

//get will get info from db 
app.get('/gamers/cards', (req, res) => {
    Cards.find((err,data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

//Listener
app.listen(port, () => console.log(`listening on localhost: ${port}`));