var express = require('express');
const fileUpload = require('express-fileupload');
const VALIDEXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];
const ENTITIES = ['doctors', 'hospitals', 'users'];
var Hospital = require('../models/hospital');
var User = require('../models/user');
var Doctor = require('../models/doctor');

app = express();
// default options
app.use(fileUpload());

app.put('/:type/:id', (req, res, next) => {

  if (!req.files) {
    return res.status(400)
      .json({
        ok: false,
        error: {
          message: 'No files were uploaded.'
        }
      });
  }

  var file = req.files.image;
  var nameParts = file.name.split('.');
  var extension = nameParts[nameParts.length - 1];
  var type = req.params.type;
  var id = req.params.id;

  if (ENTITIES.indexOf(type) < 0) {
    return res.status(400)
      .json({
        ok: false,
        error: {
          message: 'Invalid entity for image.',
          validEntities: ENTITIES.join(','),
        }
      });
  }

  if (VALIDEXTENSIONS.indexOf(extension) < 0) {
    return res.status(400)
      .json({
        ok: false,
        error: {
          message: 'Invalid extension.',
          validExtensions: VALIDEXTENSIONS.join(','),
        }
      });
  }

  if (!id) {
    return res.status(400)
      .json({
        ok: false,
        error: {
          message: 'Missing Id.',
        }
      });
  }

  var entity = undefined;
  var model = type == "hospitals" ? Hospital : type == "users" ? User : Doctors;

  model.findById(id, (err, response) => {
    if (err) {
      return res.status(500)
        .json({
          ok: false,
          error: {
            message: 'error',
            error: err
          }
        });
    }

    if (!response) {
      return res.status(400)
        .json({
          ok: false,
          error: {
            message: 'Wrong or Missing Id',
            entity: entity
          }
        });
    }

    // Use the mv() method to place the file somewhere on your server
    file.mv(`files/${type}/${id}-${new Date().getMilliseconds()}.${extension}`, function (err) {
      if (err) {
        return res.status(500).json({ ok: false });
      }
      return res.status(201)
        .json({
          ok: true,
          message: 'File uploaded!'
        });
    });
  });

});

module.exports = app;