const sharp = require('sharp');
const path = require('path');
const fs = require('fs'); 


module.exports = (req, res, next) => {
    if (!req.file) {
      return next();
    }
  
    const filePath = req.file.path;
    const fileName = req.file.filename;
    const outputDirectory = path.join(__dirname, '../images');
    const outputFilePath = path.join(outputDirectory, '../images', `resized_${fileName}`);

    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory);
      }
    sharp(filePath)
      .resize({ width: 206, height: 260 })
      .toFile(outputFilePath)
      .then(() => {
        console.log("ok")
        fs.unlink(filePath, () => {
          req.file.path = outputFilePath;
          req.file.filename = `resized_${fileName}`;
          console.log('sharp success');
          next();
        });
      })
      .catch(err => {
        console.error('Sharp error:', err);
        return next();
      });
  };
  

