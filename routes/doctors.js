var express = require('express');
app = express();
var Doctor = require('../models/doctor');
var middlewareAuth = require('../middlewares/autentication');


//
// Retrieve all the users
//
app.get('/', (req, res, next) => {

  var from = 0, limit = 0;

  if (!isNaN(req.query.from)) {
    from = Number(req.query.from);
  }

  if (!isNaN(req.query.limit)) {
    limit = Number(req.query.limit);
  }

  Doctor.find({}, 'name amg user hospital')
    .skip(from)
    .limit(limit)
    .populate('user', 'name email id')
    .populate('hospital')
    .exec((err, doctorsResponse) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: 'Error on data base',
          errors: err
        });
      }

      Doctor.count({}, (err, total) => {
        if (err) {
          res.status(500).json({
            ok: false,
            message: 'Error',
            error: err,
          });
        }
        else {
          res.status(200).json({
            ok: true,
            message: 'Get doctors',
            doctors: doctorsResponse,
            total: total
          });
        }
      });
    });
});

//
// Create a doctor
//
app.post('/', middlewareAuth.verifyToken, (req, res, next) => {
  const body = req.body;
  let doctor = new Doctor({
    name: body.name,
    user: req.user.id,
    img: body.img,
    hospital: body.hospital
  });

  doctor.save((err, savedDoctorl) => {
    if (err) {
      res.status(400).json({
        ok: false,
        message: 'error trying to create the doctor',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      message: 'doctor created',
      user: doctor
    });
  });
});

//
// Update Password
//
app.put('/:id', middlewareAuth.verifyToken, (request, response) => {
  let id = request.params.id;
  const body = request.body;

  Doctor.findById(id, 'name img id user hospital').exec((error, doctorResponse) => {

    if (error) {
      return response.status(500).json({
        ok: false,
        errors: error
      });
    }

    if (!doctorResponse) {
      return response.status(400).json({
        ok: false,
        message: { message: `the doctor with the id ${id} does not exist` }
      });
    }

    if (body.name) {
      doctorResponse.name = body.name;
    }

    if (body.img) {
      doctorResponse.img = body.img;
    }

    if (body.hospital) {
      doctorResponse.hospital = body.hospital;
    }

    // Este es el usuario que obtuve con el metodo FindById, 
    //este presenta una conexión con el objeto en la base dedatos 
    doctorResponse.save((error, savedDoctor) => {
      if (error) {
        return response.status(400).json({
          ok: false,
          message: `Error trying to update the doctor with id ${id}`,
          errors: error
        })
      }

      response.status(200).json({
        ok: true,
        user: savedDoctor
      });
    })
  });
});

//
// Delete user by id
//
app.delete('/:id', middlewareAuth.verifyToken, (request, response) => {
  let id = request.params.id;

  Doctor.findByIdAndRemove(id, (error, deletedDoctor) => {
    if (error) {
      return response.status(500).json({
        ok: false,
        errors: error
      });
    }

    if (!deletedDoctor) {
      return response.status(400).json({
        ok: false,
        message: { message: `the doctor with the id ${id} does not exist` }
      });
    }

    response.status(200).json({
      ok: true,
      doctor: deletedDoctor
    });
  });
});

module.exports = app;