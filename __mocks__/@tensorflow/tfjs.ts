import { join } from "path";
import tf from "@tensorflow/tfjs-node";

export * from "@tensorflow/tfjs-node";

export const loadLayersModel = (path: string) => {
  const url = import.meta.resolve(join(__dirname, "../../public/", path));

  return tf.loadLayersModel(url);
};

export const browser = {
  fromPixels: (pixels: {
    data: Uint32Array;
    width: number;
    height: number;
  }) => {
    const { data, width, height } = pixels;
    const rgbData = new Uint8Array(width * height * 3);

    for (let i = 0; i < width * height; i++) {
      const pixel = data[i];
      rgbData[i * 3] = pixel & 0xff; // R
      rgbData[i * 3 + 1] = (pixel >> 8) & 0xff; // G
      rgbData[i * 3 + 2] = (pixel >> 16) & 0xff; // B
    }

    return tf.tensor3d(rgbData, [height, width, 3], "int32");
  },
};
