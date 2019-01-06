import { imageToInput } from './imageUtil'
import * as tf from "@tensorflow/tfjs"
import '@tensorflow/tfjs-node'
import ProgressBar from 'progress'
import Data from './data'

const trainModel = async (model, epochs, batchSize) => {
  await Data.loadData();

  const { images: trainImages, labels: trainLabels } = Data.getTrainData();
  model.summary();

  let progressBar, epochBeginTime, millisPerStep;
  const validationSplit = 0.15;
  const numTrainExamplesPerEpoch =
    trainImages.shape[0] * (1 - validationSplit);
  const numTrainBatchesPerEpoch =
    Math.ceil(numTrainExamplesPerEpoch / batchSize);

  await model.fit(trainImages, trainLabels, {
    epochs,
    batchSize,
    validationSplit,
    callbacks: {
      onEpochBegin: async (epoch) => {
        progressBar = new ProgressBar(
          ':bar: :eta', { total: numTrainBatchesPerEpoch, head: `>` });

        console.log(`Epoch ${epoch + 1} / ${epochs}`);
        epochBeginTime = tf.util.now();
      },
      onBatchEnd: async (batch, logs) => {
        if (batch === numTrainBatchesPerEpoch - 1) {
          millisPerStep =
            (tf.util.now() - epochBeginTime) / numTrainExamplesPerEpoch;
        }
        progressBar.tick();
        await tf.nextFrame();
      },
      onEpochEnd: async (epoch, logs) => {
        console.log(
          `Loss: ${logs.loss.toFixed(3)} (train), ` +
          `${logs.val_loss.toFixed(3)} (val); ` +
          `Accuracy: ${logs.acc.toFixed(3)} (train), ` +
          `${logs.val_acc.toFixed(3)} (val) ` +
          `(${millisPerStep.toFixed(2)} ms/step)`);
        await tf.nextFrame();
      }
    }
  });

  const { images: testImages, labels: testLabels } = Data.getTestData();
  const evalOutput = model.evaluate(testImages, testLabels);

  console.log(
    `\nEvaluation result:\n` +
    `  Loss = ${evalOutput[0].dataSync()[0].toFixed(3)}; ` +
    `Accuracy = ${evalOutput[1].dataSync()[0].toFixed(3)}`);

  return model;
}

const saveModel = async model => {
  await model.save(`file://./lenet1/`);
  console.log(`Saved model to path: ./lenet1/`);
}

const predict = async data => {
  const tensor = imageToInput(data)
  const model = await tf.loadModel('file://./lenet1/model.json')
  return model.predict(tensor).dataSync()
}

const printTensor = async () => {
  await Data.loadData();
  const { images: trainImages } = Data.getTrainData();
  const values = trainImages
    .dataSync()
    .slice((784 * 5), ((784 * 5) + 784))

  for (let i = 0; i < 28; i++) {
    let string = values
      .slice((i * 28), ((i * 28) + 28))
      .reduce((acc, value) => acc + ' ' + value.toFixed(2))
    console.log(string)
  }
}

const getSingleTensor = async () => {
  await Data.loadData();
  const { images: trainImages } = Data.getTrainData();
  const values = trainImages
    .dataSync()
    .slice((784 * 5), ((784 * 5) + 784))

  return values
}

const tensorPredict = async () => {
  const data = await getSingleTensor()
  const vetor = data.map(n => n)
  console.log(JSON.stringify(vetor))
  const tensor = tf.tensor(data, [1, 28, 28, 1]);
  const model = await tf.loadModel('file://./lenet1/model.json')
  return model.predict(tensor).dataSync()
}

const run = async () => {
  let model = createLenet1()
  model = await trainModel(model, 2, 64) // modelo, epochs, batch_size
  saveModel(model)
}

const createLenet1 = () => {
  const model = tf.sequential();

  model.add(tf.layers.conv2d({
    inputShape: [28, 28, 1],
    filters: 24,
    kernelSize: 4,
    activation: 'relu',
  }));

  model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));

  model.add(tf.layers.conv2d({
    filters: 12,
    kernelSize: 8,
    activation: 'relu',
  }));

  model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

  const optimizer = 'rmsprop';
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

export {
  run,
  predict,
  printTensor,
  tensorPredict
}
