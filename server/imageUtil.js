import jpeg from 'jpeg-js'
import { PNG } from 'pngjs'
import sharp from 'sharp'
import * as tf from "@tensorflow/tfjs"
import '@tensorflow/tfjs-node'

const decodeImageJpeg = source => {
  const buf = Buffer.from(source, 'base64');
  return jpeg.decode(buf, true)
}

const decodeImage = encode => {
  const buffer = Buffer.from(encode, 'base64')
  const imagem = new PNG({ filterType: 4 }).parse(buffer)
  console.log(imagem)
  const converted = convert(imagem)
  console.log(`ASD: ${converted}`)
  return converted
}

const sharpDecode = input => {
  const buffer = Buffer.from(input, 'base64')
  const data = sharp(buffer)
    .png()
    .toBuffer()
    .then(printBase64Image)
    .catch(console.log)
  return data
}

const sharpPredict = input => {
  const buffer = Buffer.from(input, 'base64')
  const data = sharp(buffer)
    .png()
    .toBuffer()
    .then(printBase64Image)
    .catch(console.log)
  return data
}

// fundo 0 (like mnist)
const convert = image => {
  const converted = [];
  const { data, height, width } = image;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      const greyScale = (data[idx] + data[idx + 1] + data[idx + 2]) / 3.0
      converted.push((255.0 - greyScale) / 255.0);
    }
  }
  return converted;
}

const imageToInput = image => {
  const values = convert(decodeImageJpeg(image))
  const input = tf.tensor(values, [1, 28, 28, 1], 'float32');
  return input
}

const printBase64Image = image => {
  //const values = decodeImage(image)
  //const decoded = sharpDecode(image)
  //console.log("decoded: " + decoded)

  const values = image

  //values.forEach(item => console.log(item))


  for (let i = 0; i < 28; i++) {
    let string = values
      .slice((i * 28), ((i * 28) + 28))
      .reduce((acc, value) => acc + ' ' + value.toFixed(3))
    console.log(string)
  }

}

export {
  decodeImage,
  imageToInput,
  printBase64Image,
  sharpDecode
}