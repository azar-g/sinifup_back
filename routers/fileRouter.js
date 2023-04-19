import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
/*--------------------------- CONFIG ---------------------------*/
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const uploadMulti = multer({ storage: storage }).array('images', 20);
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '../public');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}__${file.originalname}`);
  },
});
const videoUpload = multer({ storage: videoStorage });

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '../public');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}__${file.originalname}`);
  },
});
const fileUpload = multer({ storage: fileStorage });

/*---------------------------  SINGLE IMG UPLOAD ---------------------------*/
router.post('/upload/img', upload.single('image'), (req, res) => {
  const file = req.file;
  const newFileName = `${file.originalname.split('.')[0]}-${Date.now()}.webp`;

  sharp(req.file.buffer)
    .webp()
    .toFile(__dirname + `../public/${newFileName}`);
  res.status(200).send({
    mesagge: 'success',
    img: `${newFileName}`,
  });
});

/*---------------------------  SINGLE VID UPLOAD ---------------------------*/
router.post('/upload/video', videoUpload.single('video'), (req, res) => {
  const file = req.file;
  console.log('file', file);
  res.status(200).send({
    mesagge: 'success',
    vid: file.filename,
  });
});

/*---------------------------  SINGLE ANY FILE UPLOAD ---------------------------*/
router.post('/upload/file', fileUpload.single('file'), (req, res) => {
  const file = req.file;
  console.log('file', file);
  res.status(200).send({
    mesagge: 'success',
    file: file.filename,
  });
});

/*--------------------------- MULTI IMG UPLOAD ---------------------------*/
router.post('/upload/multi/img', uploadMulti, (req, res) => {
  const newFiles = [];
  req.files.forEach((file) => {
    console.log(file);
    const newFileName = `${file.originalname.split('.')[0]}-${Date.now()}.webp`;
    newFiles.push(newFileName);
    sharp(file.buffer)
      .webp()
      .toFile(__dirname + `../public/${newFileName}`);
  });
  res.send({ mesagge: 'success', files: newFiles });
});

/*--------------------------- FILE DELETE ---------------------------*/
router.post('/delete', (req, res) => {
  const file = req.body.file;
  fs.unlink(__dirname + `../public/${file}`, (err) => {
    if (err) {
      res.status(400).send({
        mesagge: 'Something went wrong!',
        err,
      });
    } else {
      res.send({ mesagge: 'DELETED', file: req.body.img });
    }
  });
});

export default router;
