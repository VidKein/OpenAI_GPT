import fs from "fs";

import OpenAI from "openai";

const openai = new OpenAI();
//Транскрибирует аудио на язык ввода.
async function transcriptionSpeechText() {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream("ahoy.mp3"),//файл для трансляции
    model: "whisper-1",// модель
    response_format:'json', // Формат вывода
    temperature: 0, // Температура
    language:'cs' // Язык входного файла (ISO-639-1) - увиличивает точность перевода -
    //https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
  });

  console.log(transcription.text);
}
transcriptionSpeechText();