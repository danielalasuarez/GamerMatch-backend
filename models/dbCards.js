import mongoose from 'mongoose'

const cardSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imgUrl: { type: String },
    killDeathRatio: { type: String },
    gameHighlights: { type: String }

     

})

//in the () you define collection name 
export default mongoose.model('cards', cardSchema);