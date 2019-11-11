var express = require('express');
const path = require('path');
const fs = require('fs');
app = express();
// console.log(app);
app.get('/:type/:img', (req, res, next) => {

  const type = req.params.type;
  const img = req.params.img;
  let pathImage = path.resolve(__dirname, `../files/${type}/${img}`);
  if (fs.existsSync(pathImage)) {
    res.sendFile(pathImage);
  } else {
    let pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
    res.sendFile(pathNoImage);
  }
});

module.exports = app;