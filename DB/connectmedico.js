const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/medico",{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log('Database Connection Established!'))
.catch((err)=>console.log(err));