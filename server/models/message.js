const { default: mongoose } = require("mongoose")

// init model and schema for mongodb
const Message = mongoose.model("Message", new mongoose.Schema({
    message:String,
    username:String,
    room:String,
    createDateTime:Date
}))

exports.Message = Message