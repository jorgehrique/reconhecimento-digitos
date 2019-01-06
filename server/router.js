import express from 'express'
import { run, predict, printTensor, tensorPredict } from './convNet'
import { decodeImage, imageToInput, printBase64Image, sharpDecode } from './imageUtil';

const router = express.Router()

router.post('/predict', async (req, res) => {
  const { imagem } = req.body
  const prediction = await predict(imagem);
  res.json({ prediction: prediction })
})

router.post('/run', (req, res) => {
  run()
  res.json({})
})

router.post('/console.log', (req, res) => {
  const { imagem } = req.body;
  console.log(`"${imagem}"`)
  res.json({})
})

router.post('/printTensor', (req, res) => {
  printTensor()
  res.json({})
})

router.post('/printImagem', (req, res) => {
  let { imagem } = req.body
  sharpDecode(imagem)
  res.json({})
})

router.post('/tensorPredict', async (req, res) => {
  const prediction = await tensorPredict()
  console.log(prediction)
  res.json({ prediction: prediction })
})

export default router;