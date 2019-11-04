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

    userResponse = { name: userResponse.name, email: userResponse.email }                
    let token = jwt.sign({ user: userResponse }, SEED, { expiresIn: 14400 });
    response.status(200).json({
      ok: true,
      message: 'login succefull',
      user: userResponse,
      token: token
    })
  });
});

module.exports = app;