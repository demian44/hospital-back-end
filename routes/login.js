var express = require('express');
var bcrypt = require('bcryptjs');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;


app = express();

//GOOGLE
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

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


async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];

  return {
    name: payload.name,
    google: true,
    email: payload.email,
    img: payload.picture
  }
}

app.post('/google', async (req, res) => {
  let token = req.body.token;
  var googleUser = await verify(token).catch(error => {
    return res.status(403).json({
      ok: false,
      message: 'Token de goolge inválido',
      error: error,
    });
  });


  return res.status(200).json({
    ok: true,
    message: 'Todo Piola',
    googleUser: googleUser
  })
});

module.exports = app;