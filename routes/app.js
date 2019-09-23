var express = require('express');

app = express();
console.log(app);
app.get('/',(req, res, next)=>{
  res.status(200).json({
    ok: true,
    message: 'Petition realized succefuslly'
  });
});


module.exports = app;