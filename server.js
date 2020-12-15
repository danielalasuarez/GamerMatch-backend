//NOTE: in the package.json we added "type": "module" in order to get ES6 and be able to use import instead of require
//we also added the start script

import express from 'express'
import mongoose from 'mongoose'


// App Config
const app = express();
const port = process.env.PORT || 8001

//Middleware
//DB config
//API endpoints

app.get('/', (req, res) => res.status(200).send('working'));

//Listener
app.listen(port, () => console.log(`listening on localhost: ${port}`));