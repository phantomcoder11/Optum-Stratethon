const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
// const ValidationError = require('validation-error');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

require('./DB/connectmedico');
const Medicomodel = require('./mongo/registration')
const Profilemodel = require('./mongo/makeprofile')
const Prescriptionmodel = require('./mongo/issueprescription')
const Doctorreg = require('./mongo/d_registration')
const port= process.env.PORT || 5000;

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const view_path = path.join(__dirname, './template/views');
const partial_path = path.join(__dirname, './template/partials');

app.set('view engine', 'hbs');
app.set('views', view_path);
hbs.registerPartials(partial_path);

app.get('/',(req,res)=>{
    res.render('home');
});
app.get('/test',(req,res)=>{
    res.render('Doctor/extra');
});
app.get('/login',(req,res)=>{
    res.render('main');
});
app.get('/register',(req,res)=>{
    res.render('register',{
        viewTitle : 'Insert Patient'
    });
});
app.get('/doctor/register',(req,res)=>{
    res.render('Doctor/registerdoctor');
})
app.get('/doctor/logindoctor',(req,res)=>{
    res.render('Doctor/logindoctor');
})
app.get('/doctor',(req,res)=>{
    res.render('Doctor/doctor');
});
app.get('/doctor/pescription',async (req,res)=>{
    const {email} = req.query;
    console.log(email)
    const checkmail = await Doctorreg.findOne({email : email})
    console.log(checkmail)
    if(checkmail){
        return res.render('Doctor/pescription', {checkmail});
    }
    res.render('Doctor/pescription');
})
let mobile = "";
app.get('/patient/patientview',async (req,res)=>{
    const {email} = req.query;
    // console.log(email);
    const result = await Medicomodel.findOne({email : email});
    // console.log(result);
    mobile = result.phone;
    //console.log(mobile);
     const med_res = await Prescriptionmodel.findOne({mobile : result.phone})
    if(result){
        return res.render('Patient/patientview',{result,med_res});
    }
    //res.render('Patient/patientview');
})

app.get('/patient/profile',async (req,res)=>{
    const num_res = await Profilemodel.findOne({mobile : mobile});
    console.log(num_res);
    if(num_res){
        return res.render('Patient/m_profile',{num_res});
    }
    else{
    res.render('Patient/profile');
    }
})
// app.get('/patient/bemar',(req,res)=>{
//         Doctorreg.find((err,docs)=>{
//             if(!err){
//                 return res.render('Patient/bemar',{
//                     bemar : docs
//                 });
//             }
//             else{
//                 res.send("error in retriving the doctors " + err);
//             }
//         })  
// })
app.get('/patient/patientprescrip', async (req,res)=>{
    const pres_res = await Prescriptionmodel.findOne({mobile : mobile});
    console.log(pres_res);
    if(pres_res){
        return res.render('Patient/patientprescrip',{pres_res});
    }
    Doctorreg.find((err,docs)=>{
        if(!err){
            return res.render('Patient/bemar',{
                bemar : docs
            });
        }
        else{
            res.send("error in retriving the doctors " + err);
        }
    })  
})
app.get('/list',(req,res)=>{
    Medicomodel.find((err,docs)=>{
        if(!err){
           return res.render('list',{
                list: docs
            });
        }
        else{
            console.log('Error in retrieving List : ' + err);
        }
    })
})
app.post('/register',async (req,res)=>{
    try{
        const pass = req.body.password
        const cpass= req.body.cpassword
        if(pass === cpass){
            const registermedico = new Medicomodel({
            username : req.body.username,
            email : req.body.email,
            phone : req.body.phone,
            password : req.body.password
            })
            const result = await registermedico.save();
            res.status(201).redirect('/login')
        }
        else{
            res.send('password confirmation failed!')
        }
    }
    catch(err){
        res.status(404).json({err})
    }
})


app.post('/doctor/register', async(req,res)=>{
    try{
        const pass= req.body.password;
        const cpass= req.body.cpassword;
        if(pass=== cpass){
      const docreg = new Doctorreg({
          username : req.body.username,
          email : req.body.email,
          phone : req.body.phone,
          mlicence : req.body.mlicence,
          password: req.body.password
      })
      const result = await docreg.save()
      res.status(201).redirect('/doctor/logindoctor')
    }
    else{
        res.send("Password confirmation failed!")
    }
    }
    catch(err){
     res.status(404).json({err})
    }
})
app.post('/doctor/logindoctor', async (req,res)=>{
    try{
     const email = req.body.email
     const pass = req.body.password

    const checkemail = await Doctorreg.findOne({email : email})

    const checkpass = await bcrypt.compare(pass,checkemail.password);
    console.log(checkpass)
    if(checkpass){
        res.status(201).redirect('/doctor/pescription?email=' + email);
    }
    else{
        res.status(404).redirect('/doctor/logindoctor')
    }
    }
    catch(err){
        res.status(404).json({err});
    }
})
app.post('/login',async (req,res)=>{
    try{
        const mail= req.body.email
        const pass= req.body.password

        const medicomail = await Medicomodel.findOne({email : mail});

        const result = await bcrypt.compare(pass,medicomail.password);
        if(result){
            res.status(201).redirect('/patient/patientview?email=' + mail );
        }
        else
        res.send('Invalid login details!')
    }
    catch(err){
        res.status(404).json({err})
    }
})
app.post('/patient/profile', async (req,res)=>{
    try{
        const mobile = req.body.mobile;

        const email_check = await Profilemodel.findOne({mobile:mobile})
        // console.log(email_check.mobile)

        // if(email_check.mobile === mobile){
        //     res.send('User Already Exists!')
        // }
        // else
        // {
        const profilemedico = new Profilemodel({
            name : req.body.name,
            surname: req.body.surname,
            mobile : req.body.mobile,
            address : req.body.address,
            postcode : req.body.postcode,
            email : req.body.email,
            education : req.body.education,
            state : req.body.state,
            country: req.body.country,
            experience : req.body.experience,
            additional : req.body.additional
        })
        const result = await profilemedico.save();
        return res.status(201).render('Patient/patientview')
     }
    //}
    catch(err){
        res.status(404).json({err})
    }
})
app.post('/doctor/pescription', async (req,res)=>{
    console.log(req.body)
    try{
      const pescriptionmodel = new Prescriptionmodel({
          doctor: req.body.doctor,
          chamber: req.body.chamber,
          address: req.body.address,
          mobile: req.body.mobile,
          name: req.body.name,
          age: req.body.age,
          gender: req.body.gender,
          symptoms: req.body.symptoms,
          advice: req.body.advice,
          tests: req.body.tests,
          medicine: req.body.medicine
      });
      const result = await pescriptionmodel.save()
      console.log(result)
    //   res.status(201).redirect('/')
      res.status(201).json(result)
    }
    catch(err){
      res.status(404).json({err})
    }
})

app.listen(port, ()=>{
    console.log('listening on port ${port}');
})
