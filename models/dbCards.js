import mongoose from 'mongoose'

const cardSchema = mongoose.Schema({
    name: String,
    imgUrl: String,

})

//in the () you define collection name 
export default mongoose.model('cards', cardSchema);