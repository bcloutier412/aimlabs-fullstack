const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  user_id: String,
  username: String,
  minutes: Number,
  datasetIndex: Number,
  accuracy: String,
  score: Number,
})

scoreSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const Score = mongoose.model('Score', scoreSchema)

module.exports = { Score }