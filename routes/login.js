var express = require('express');
var bcrypt = require('bcryptjs');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

app = express();

app.post('/', (request, response) => {

  User.findOne({ email: request.body.email }, (error, userResponse) => {
    if (error) {
      return response.status(500).json({
        ok: false,
        message: "Error en la base de datos",
        error: error
      });
    }

    if (!userResponse) {
      return response.status(400).json({
        ok: false,
        message: "Usuario inválido",
      });
    }

    if (!userResponse) {
      return response.status(400).json({
        ok: false,
        message: "Usuario inválido",
      });
    }

    if (!bcrypt.compareSync(request.body.password, userResponse.password)) {
      return response.status(400).json({
        ok: false,
        message: "Password incorrecto, gil",
      });
    }

    userResponse = { name: userResponse.name, email: userResponse.email, id: userResponse._id }                
    let token = jwt.sign({ user: userResponse }, SEED, { expiresIn: 1014400 });
    response.status(200).json({
      ok: true,
      message: 'login succefull',
      user: userResponse,
      token: token
    })
  });
});

app.post('/google',(req, res)=>{

  return res.status(200).json({
    ok: true,
    message: 'Todo Piola',
    test
  })

});


module.exports = app;