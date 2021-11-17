const mongoose = require('mongoose')
const bcrypt= require('bcryptjs')

const medischema = new mongoose.Schema({
    username : {
        type: String,
        required: 'This field is required.'
    },
    email : {
        type: String,
        required: true,
        unique: 'This field is unique.'
    },
    phone :{
        type: String,
        required: 'This field is required.',
        unique: 'This field is unique.'
    },
    password : {
        type: String,
        required: true,
        minlength: 8
    }
},{timestamps: true})

// medischema.path('email').validate(function (email) {
//     var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return emailRegex.test(email.text); // Assuming email has a text attribute
//  }, 'The email field cannot be empty.');

medischema.pre("save", async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10)
    }
    next()
})
const Medicomodel = mongoose.model('Medimodel',medischema)
module.exports = Medicomodel