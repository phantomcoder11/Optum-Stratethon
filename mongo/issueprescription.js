const mongoose = require('mongoose')

const prescriptionschema = new mongoose.Schema({
  doctor:{
      type: String
  },
  chamber : {
      type: String
  },
  address:{
    type: String
},
mobile : {
    type: String
},
  name : {
      type: String
  },
  age: {
      type: String
  },
  gender : {
      type: String
  },
  symptoms: {
     type: String
  },
  advice: {
      type: String
  },
  tests: {
      type: String
  },
  medicine: [{
      m_name :{
          type: String
      },
      m_take : {
          type: String
      },
      m_after : {
          type: String
      }
  }]
},{timestamps: true})

const Prescriptionmodel = mongoose.model('Prescriptionmodel',prescriptionschema)
module.exports = Prescriptionmodel
