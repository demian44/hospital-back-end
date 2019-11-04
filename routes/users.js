var express = require('express');
app = express();
var bcrypt = require('bcryptjs');
var User = require('../models/user');
var middlewareAuth = require('../middlewares/autentication');

//
// Retrieve all the users
//
app.get('/', (req, res, next) => {
  User.find({}, 'name email img id role').exec((err, usersResponse) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'Error on data base',
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      message: 'Get users',
      users: usersResponse
    });
  });
});


//
// Create a user
//
app.post('/', middlewareAuth.verifyToken, (req, res, next) => {
  const body = req.body;
  let user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  user.save((err, saveUser) => {
    if (err) {
      res.status(400).json({
        ok: false,
        message: 'error trying to create the user',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      message: 'user created',
      user: req.user
    });
  });
});




//
// Update Password
//
app.put('/:id', middlewareAuth.verifyToken, (request, response) => {
  let id = request.params.id;
  const body = request.body;

  User.findById(id, 'name role img email id').exec((error, userResponse) => {

    if (error) {
      return response.status(500).json({
        ok: false,
        errors: error
      });
    }

    if (!userResponse) {
      return response.status(400).json({
        ok: false,
        message: { message: `the user with the id ${id} does not exist` }
      });
    }

    userResponse.name = body.name;
    userResponse.email = body.email;
    userResponse.role = body.role;

    // Este es el usuario que obtuve con el metodo FindById, 
    //este presenta una conexión con el objeto en la base dedatos 
    userResponse.save((error, saveUser) => {
      if (error) {
        return response.status(400).json({
          ok: false,
          message: `Error trying to update the user with id ${id}`,
          errors: error
        })
      }

      response.status(200).json({
        ok: true,
        user: saveUser
      });
    })
  });
});

//
// Delete user by id
//
app.delete('/:id', middlewareAuth.verifyToken, (request, response) => {
  let id = request.params.id;

  User.findByIdAndRemove(id, (error, deletedUser) => {
    if (error) {
      return response.status(500).json({
        ok: false,
        errors: error
      });
    }

    if (!deletedUser) {
      return response.status(400).json({
        ok: false,
        message: { message: `the user with the id ${id} does not exist` }
      });
    }

    response.status(200).json({
      ok: true,
      user: deletedUser
    });
  });
});

module.exports = app;