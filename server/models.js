import * as tf from "@tensorflow/tfjs"
import '@tensorflow/tfjs-node'

export {
  createLenet1,
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

  model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

  const optimizer = 'rmsprop';
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}