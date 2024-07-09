const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const uploadFileInHumeAI = require('./controllers/job.controller')

require('dotenv').config();


const app = express();
const port = process.env.PORT;


mongoose.connect(process.env.MONGO_DB_URI);

const upload = multer({dest: 'uploads/'});

app.post('/api/upload-file', upload.single('file'), uploadFileInHumeAI)

app.listen(port, () => {
    console.log(`Server is up and running on ${port}`)
});
