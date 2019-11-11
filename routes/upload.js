var express = require('express');
const fileUpload = require('express-fileupload');
var VALIDEXTENSIONS = require('../models/consts').VALIDEXTENSIONS;
var ENTITIES = require('../models/consts').ENTITIES;
var UPLOADPATH = require('../models/consts').UPLOADPATH;
var fs = require('fs');
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

  const file = req.files.image;
  const nameParts = file.name.split('.');
  const extension = nameParts[nameParts.length - 1];
  const type = req.params.type;
  const id = req.params.id;

  if (ENTITIES.indexOf(type) < 0) {
    return res.status(400)
      .json({
        ok: false,
        error: {
          message: 'Invalid entity for image.',
          validEntities: ENTITIES.join(', '),
        }
      });
  }

  if (VALIDEXTENSIONS.indexOf(extension) < 0) {
    return res.status(400)
      .json({
        ok: false,
        error: {
          message: 'Invalid extension.',
          validExtensions: VALIDEXTENSIONS.join(', '),
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

  var model = type == "hospitals" ? Hospital : type == "users" ? User : Doctors;

  model.findById(id, (err, entity) => {
    if (err) {
      return res.status(500)
        .json({
          ok: false,
          error: {
            message: 'Error',
            error: err
          }
        });
    }

    if (!entity) {
      return res.status(400)
        .json({
          ok: false,
          error: {
            message: 'Wrong Id'
          }
        });
    }

    if (fs.existsSync(`${UPLOADPATH}${type}/${entity.img}`)) {
      fs.unlink(`${UPLOADPATH}${type}/${entity.img}`, err => {
        if (err) {
          return res.status(500).json({
            ok: false,
            message: 'Error trying to update the image.',
            error: err
          });
        }
      });
    }

    entity.img = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(`${UPLOADPATH}${type}/${entity.img}`, function (err) {
      if (err) {
        return res.status(500).json({ ok: false });
      }

      entity.save((err, updatedEntity) => {
        
        if (err) {
          return res.status(500)
          .json({
            ok: false,
            error: err
          });
        }
        
        if(updatedEntity.password){                    
          updatedEntity.password = undefined;
        }

        return res.status(201)
          .json({
            ok: true,
            [type.substring(0, type.length - 2)]: updatedEntity
          });
      });
    });
  });
});

module.exports = app;