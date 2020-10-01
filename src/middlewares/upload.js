const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'avatars');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.originalname.replace(ext, '')}-${Date.now()}${ext}`);
  },
});

module.exports = multer({
  storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg)|(jpeg)|(png)$/)) {
      return cb(new Error('File must be an image'));
    }
    cb(undefined, true);
  },
}).single('avatar');
