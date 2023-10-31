const path = require('path');
const vision = require("@google-cloud/vision");
const recebeString = require("../regexString");

const client = new vision.ImageAnnotatorClient({
  keyFilename: path.resolve('src', 'config', 'keys.json'),
})

/**
 *
 * Receive two Strings and returns the greater one.
 *
 * @param {String} text1
 * @param {String} text2
 * @returns The greater String
 */

/**
 *
 * Receive an image from the current directory and detect the text in it.
 *
 * @param {String} image Path to the image file.
 * @returns The text from the image.
 * @example await textScraping("image.png");
 */
async function textScraping(image) {
  try {
    const text1 = await client.textDetection(image);
    const result1 = text1[0].textAnnotations[0].description;
    return recebeString(result1);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = textScraping;
