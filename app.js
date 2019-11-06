// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Import routes
var appRoutes = require('./routes/app');
var usersRoutes = require('./routes/users');
var hospitalsRoutes = require('./routes/hospitals');
var doctorsRoutes = require('./routes/doctors');
var loginRoutes = require('./routes/login');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');

// Initialize express
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// DB connections
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (err, res) => {
  if(err){
   throw err;
  }
  console.log('Base de datos: \x1b[32m%s\x1b[0m','Online');
});

// Routes
app.use('/users', usersRoutes);
app.use('/hospital', hospitalsRoutes);
app.use('/doctor', doctorsRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/', appRoutes);

app.listen(3000, () => {
  console.log('Express server running, port: 3000, \x1b[32m%s\x1b[0m', 'online');
});
