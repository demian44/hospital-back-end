var express = require('express');
app = express();
var Doctor = require('../models/doctor');
var Hospital = require('../models/hospital');
var User = require('../models/user');
var middlewareAuth = require('../middlewares/autentication');
var USERS = 'users';
var HOSPITALS = 'hospitals';
var DOCTORS = 'doctors';
//
// Retrieve all the users
//
app.get('/collections/:collection/:search', (req, res, next) => {

  var collection = req.params.collection.toLowerCase();
  var from = req.query.from && !isNaN(req.query.from) ? Number(req.query.from) : 0;
  var limit = req.query.limit && !isNaN(req.query.limit) ? Number(req.query.limit) : 0;

  var searchRegExp = new RegExp(req.params.search, 'i');
  var promise;

  switch (collection) {
    case USERS:
      promise = findEntities(User, [{ name: searchRegExp }, { email: searchRegExp }], USERS, from, limit, 'name email _id');
      break;

    case DOCTORS:
      promise = findEntities(Doctor, [{ name: searchRegExp }], DOCTORS, from, limit, '', 'hospital', 'name id');
      break;

    case HOSPITALS:
      promise = findEntities(Hospital, [{ name: searchRegExp }], HOSPITALS, from, limit, '', 'user', 'name email id');
      break;

    default:
      res.status(400).json({
        ok: false,
        error: "Los tipos de busquedas solo son users, hospitals o doctors",
      });

      break;
  }

  promise.then((response) => {
    res.status(200).json({
      ok: true,
      message: 'Result',
      [collection]: response
    });
  })
    .catch((err) => {
      res.status(500).json({
        ok: false,
        error: err.message,
      });
    });

});

//
// Retrieve all the users
//
app.get('/todo/:search', (req, res, next) => {

  var searchRegExp = new RegExp(req.params.search, 'i');
  var from = req.query.from && !isNaN(req.query.from) ? Number(req.query.from) : 0;
  var limit = req.query.limit && !isNaN(req.query.limit) ? Number(req.query.limit) : 0;

  Promise.all([
    findEntities(Hospital, [{ name: searchRegExp }], HOSPITALS, from, limit, '', 'user', 'name email id'),
    findEntities(Doctor, [{ name: searchRegExp }], DOCTORS, from, limit, '', 'hospital', 'name id'),
    findEntities(User, [{ name: searchRegExp }, { email: searchRegExp }], USERS, from, limit, 'name email _id'),
  ])
    .then((response) => {
      res.status(200).json({
        ok: true,
        message: 'Result',
        hospitals: response[0],
        doctors: response[1],
        users: response[2],
      });
    })
    .catch((err) => {
      res.status(500).json({
        ok: false,
        message: "Error al intentar obtener las entidades",
        error: err,
      });
    });

});

//
// Solo sirve con una condición
//
function findEntity(model, searchRegExp, entityName) {
  return new Promise((resolve, reject) => {
    model.find({ name: searchRegExp }, (err, entities) => {
      if (err) {
        reject(`Error finding ${entityName}`, err);
      }
      else {
        resolve(entities);
      }
    });
  });
}

//
// Sirve con una o varias condiciones
//
function findEntities(model, conditions, entityName, from, limit, fields = '', pupulEnt = '', populEntFields = '') {
  return new Promise((resolve, reject) => {
    // model, representa un modelo de la base de datos
    model.find({}, fields)
      .skip(from)
      .limit(limit)
      .or(conditions)
      .populate(pupulEnt, populEntFields)
      .exec((err, entities) => {
        if (err) {
          reject(`Error searching ${entityName}`, err);
        }
        else {
          resolve(entities);
        }
      });
  });
}

module.exports = app;