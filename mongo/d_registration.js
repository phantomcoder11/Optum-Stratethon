const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const dregister = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone : {
        type: String,
        required :true
    }, 
    mlicence : {
       type: String,
       required: true
    },
    password: {
        type: String,
        required: true
    }
},{timestamps: true});

dregister.pre("save", async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10)
    }
    next();
})

const Doctorreg = mongoose.model('Doctorreg',dregister)
module.exports = Doctorreg