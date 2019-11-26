var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var _Schema = mongoose.Schema;

let validRoles = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} is not a valid role'
};

var schemaUsers = new _Schema({

  name: { type: String, required: [true, 'The name is missing' /* Mensaje quje retorna si no se incluye el campo */] },
  email: { type: String, unique: true, required: [true, 'The email is missing'] },
  password: { type: String, required: [true, 'The password is missing'] },
  img: { type: String, required: false },
  role: { type: String, required: true, default: 'USER_ROLE', enum: validRoles /** Este enum indica los valores admitidos */ },
  google: { type: Boolean, default: false }  
});

schemaUsers.plugin(uniqueValidator, {message: '{PATH} must be unique'});

module.exports = mongoose.model('User', schemaUsers);