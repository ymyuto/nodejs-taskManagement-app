const mongoose = require("mongoose");

const MemoSchema = new mongoose.Schema({
    userid:{
        type:String,
        required:true,
        maxlength: 10,
    
    },
    title:{
        type:String,
        required:true,
    },
    content:{
        type: String,
        required:true,

    },
    completion:{
        type:Boolean,
        required:true,
    },

});

module.exports = mongoose.model("Memo",MemoSchema);