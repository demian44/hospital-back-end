// Requires
var express = require('express');
var mongoose = require('mongoose');

// Initialize express
var app = express();

// DB connections
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (err, res) => {
  if(err){
   throw err;
  }
  console.log('Base de datos: \x1b[32m%s\x1b[0m','!!!!!!!!!!Online!!!!!!!!!!');

});

// Routes
app.get('/', (req, res, next) => {
  res.status(201).json({
    ok: true,
    message: 'testing'
  });
});

app.listen(3000, () => {
  console.log('Express server running, port: 3000, \x1b[32m%s\x1b[0m', 'online');
});
