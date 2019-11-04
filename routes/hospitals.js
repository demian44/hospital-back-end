var express = require('express');
app = express();
var bcrypt = require('bcryptjs');
var Hospital = require('../models/hospital');
var middlewareAuth = require('../middlewares/autentication');


//
// Retrieve all the users
//
app.get('/', (req, res, next) => {
  Hospital.find({}, 'name amg user').exec((err, hospitalsResponse) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'Error on data base',
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      message: 'Get hospitals',
      hospitals: hospitalsResponse
    });
  });
});

//
// Create a user
//
app.post('/', middlewareAuth.verifyToken, (req, res, next) => {
  const body = req.body;
  let hospital = new Hospital({
    name: body.name,
    user: req.user.id,    
    img: body.img    
  });

  hospital.save((err, savedHospital) => {
    if (err) {
      res.status(400).json({
        ok: false,
        message: 'error trying to create the hospital',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      message: 'hospital created',
      user: hospital
    });
  });
});

//
// Update Password
//
app.put('/:id', middlewareAuth.verifyToken, (request, response) => {
  let id = request.params.id;
  const body = request.body;

  Hospital.findById(id, 'name img id user').exec((error, hospitalResponse) => {

    if (error) {
      return response.status(500).json({
        ok: false,
        errors: error
      });
    }

    if (!hospitalResponse) {
      return response.status(400).json({
        ok: false,
        message: { message: `the hospital with the id ${id} does not exist` }
      });
    }
    
    if(body.name){
      hospitalResponse.name = body.name;
    }

    if(body.img){
      hospitalResponse.img = body.img;
    }

    // Este es el usuario que obtuve con el metodo FindById, 
    //este presenta una conexión con el objeto en la base dedatos 
    hospitalResponse.save((error, saveHospital) => {
      if (error) {
        return response.status(400).json({
          ok: false,
          message: `Error trying to update the hospital with id ${id}`,
          errors: error
        })
      }

      response.status(200).json({
        ok: true,
        user: saveHospital
      });
    })
  });
});

//
// Delete user by id
//
app.delete('/:id', middlewareAuth.verifyToken, (request, response) => {
  let id = request.params.id;

  Hospital.findByIdAndRemove(id, (error, deletedHospital) => {
    if (error) {
      return response.status(500).json({
        ok: false,
        errors: error
      });
    }

    if (!deletedHospital) {
      return response.status(400).json({
        ok: false,
        message: { message: `the hospital with the id ${id} does not exist` }
      });
    }

    response.status(200).json({
      ok: true,
      hospital: deletedHospital
    });
  });
});

module.exports = app;