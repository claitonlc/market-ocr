const express = require("express");
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp"); // Biblioteca para manipulação de imagens
const cors = require("cors");
const textScraping = require("./textScraping");


const app = express();

// configuracao do multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
})

const PORT = 3000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/", upload.single('img'), async (req, res, next) => {
  try {
    const image = req.file;

    if (!image)
      next(new Error("There is no image"));

    // Redimensione e recorte a imagem
    const processedImageBuffer = await processImage(image.buffer);

    const text = await textScraping(processedImageBuffer);
    res.status(200).send(text);
  } catch (error) {
    console.error(error);
    next(error);
  }
})

async function processImage(imageBuffer) {
  // Primeiro recorte
  const firstCropImageBuffer = await sharp(imageBuffer)
    .resize(1429, 2932 )
    .extract({ left: 0, top: 500, width: 1429, height: 2432 }) // Recorte de 750 x 265 px
    .greyscale() // Aplica a escala de cinza
    .toBuffer();

  // Salve o primeiro recorte em um arquivo
  fs.writeFileSync("first_crop.jpg", firstCropImageBuffer);

  // Segundo recorte na imagem já recortada
  const secondCropImageBuffer = await sharp(firstCropImageBuffer)
    .extract({ left: 0, top: 0, width: 1429, height: 2150 }) // Segundo recorte de 1500 x 145 px
    .greyscale() // Aplica a escala de cinza
    .toBuffer();

  // Salve o segundo recorte em um arquivo (opcional)
  fs.writeFileSync("second_crop.jpg", secondCropImageBuffer);

  return secondCropImageBuffer; // Retorne o segundo recorte para uso posterior
}


// server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
