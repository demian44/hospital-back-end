var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var schemaDoctors = new Schema({

  name: { type: String, required: [true, 'The name is missing' /* Mensaje quje retorna si no se incluye el campo */] },
  img: { type: String, required: false },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'The hospital is required'] }
}, { collection: "doctors" });

schemaDoctors.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('Doctor', schemaDoctors);