
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

exports.verifyToken = function(req, res, next){
  
  var token = req.query.token;
  jwt.verify(token, SEED,(err,decoded)=>{
    if(err){
      return res.status(401).json({
        ok: false,
        message: 'token inválido',
        error: err
      });
    }
    
    req.user = decoded.user

    next();

  });
}