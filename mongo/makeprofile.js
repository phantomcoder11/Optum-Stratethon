const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { text } = require('body-parser')

const profileschema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String
    },
    postcode: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    education: {
        type: String
    },
    state:{
        type: String
    },
    country: {
        type: String
    },
    experience: {
        type: String
    },
    additional: {
        type: String
    }
},{timestamps: true})

const Profilemodel = mongoose.model('Profilemodel',profileschema)
module.exports = Profilemodel