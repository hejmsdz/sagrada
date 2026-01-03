import * as tf from "@tensorflow/tfjs";
import { NUM_ROWS, NUM_COLUMNS, VALUES, COLORS, Board } from "@/game/types";

type ModelType = {
  colorsModel: tf.LayersModel;
  numbersModel: tf.LayersModel;
};
let modelPromise: Promise<ModelType> | null = null;

export const loadModel = async () => {
  if (modelPromise) {
    return modelPromise;
  }

  modelPromise = Promise.all(
    ["/tfjs/colors/model.json", "/tfjs/numbers/model.json"].map((path) =>
      tf.loadLayersModel(path),
    ),
  ).then(([colorsModel, numbersModel]) => ({ colorsModel, numbersModel }));
};

const IMAGE_SIZE = 32;
export const IMAGE_WIDTH = IMAGE_SIZE * NUM_COLUMNS;
export const IMAGE_HEIGHT = IMAGE_SIZE * NUM_ROWS;

const numberLabels = [null, ...VALUES];
const colorLabels = [null, ...COLORS];

const getImageSlices = (image: tf.Tensor3D) =>
  tf.tidy(() => {
    const slices = [];

    for (let row = 0; row < NUM_ROWS; row++) {
      for (let column = 0; column < NUM_COLUMNS; column++) {
        slices.push(
          image.slice(
            [row * IMAGE_SIZE, column * IMAGE_SIZE],
            [IMAGE_SIZE, IMAGE_SIZE],
          ),
        );
      }
    }

    return tf.stack(slices).div(255);
  });

export const scan = async (
  image: Parameters<typeof tf.browser.fromPixels>[0],
) => {
  if (!modelPromise) {
    throw new Error("Load model first!");
  }
  const models = await modelPromise;

  const { colors, numbers } = tf.tidy(() => {
    const inputImage = tf.browser.fromPixels(image);

    const [height, width, numChannels] = inputImage.shape;
    if (width !== IMAGE_WIDTH || height !== IMAGE_HEIGHT || numChannels !== 3) {
      throw new RangeError(`Invalid image size`);
    }

    const slices = getImageSlices(inputImage);

    const predict = (model: tf.LayersModel) =>
      tf.tidy(() => {
        const scores = model.predict(slices) as tf.Tensor;
        const confidence = scores.max(1).mean();
        const predictions = scores.argMax(1);

        return {
          predictions: predictions.dataSync(),
          confidence: confidence.dataSync()[0],
        };
      });

    return {
      colors: predict(models.colorsModel),
      numbers: predict(models.numbersModel),
    };
  });

  let numEmptyFields = 0;

  const board = Board.build((row, column) => {
    const index = row * NUM_COLUMNS + column;
    const color = colorLabels[colors.predictions[index]];
    const value = numberLabels[numbers.predictions[index]];

    if (color === null || value === null) {
      numEmptyFields++;
      return null;
    }

    return { color, value };
  });

  const isEmpty = numEmptyFields === NUM_ROWS * NUM_COLUMNS;

  return {
    board,
    confidence: colors.confidence * numbers.confidence,
    isEmpty,
  };
};
