const express = require("express");
const multer = require("multer");
const { OpenAI } = require("openai");
//создаем метод для работы с файдами
const fs = require('fs');

const router = express.Router();
const upload = multer();

const openai = new OpenAI();

async function transcribe(buffer) {
    const response = await openai.audio.transcriptions.create({
        file: buffer,//файл для трансляции
        model: "whisper-1",// модель
        response_format:'json', // Формат вывода
        temperature: 0, // Температура
        language:'cs' // Язык входного файла (ISO-639-1) - увиличивает точность перевода -
        //https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
      });
    return response;
}

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

router.post("/", upload.any('file'), (req, res) => {
    audio_file = req.files[0];
    buffers = audio_file.buffer;
    buffers.name = audio_file.originalname;
    

    const buff = Buffer.from(buffers, 'base64');
    fs.writeFileSync('./uploads/'+buffers.name, buff);

    const response = transcribe(fs.createReadStream("./uploads/"+buffers.name));


    response.then((data) => {
        res.send({ 
            type: "POST", 
            transcription: data.text,
            audioFileName: buffers.name
        });
    }).catch((err) => {
        res.send({ type: "POST", message: err });
    });
});

module.exports = router;
