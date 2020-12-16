import mongoose from 'mongoose'

const cardSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    imgUrl: String,
    killDeathRatio: String,
    gameHighlights: String

     

})

//in the () you define collection name 
export default mongoose.model('cards', cardSchema);