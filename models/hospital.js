var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var schemaHospitals = new Schema({

  name: { type: String, required: [true, 'The name is missing' /* Mensaje que retorna si no se incluye el campo */]},
  img: { type: String, required: false },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { collection: "hospitals" });

schemaHospitals.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('Hospital', schemaHospitals);