/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 *
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *
 * @format
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const valid = validFileTypes.find((type) => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

export function readTextFromFile (file) {
  const valid = file.type === 'application/json'
  if (!valid) {
    throw Error('Provided file is not a JSON file')
  }
  const reader = new FileReader()
  const promise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  })
  reader.readAsText(file);
  return promise;
}

/**
 * calculates player's mark based on the correctness and speed
 * @param {object} answerInfo
 * @param {string} answerInfo.answeredAt
 * @param {string} answerInfo.questionStartedAt
 * @param {boolean} answerInfo.correct
 * @param {object} question
 * @param {number} question.points
 */
export function calculatePlayerScore (answerInfo, question) {
  const SPEED_SCORE_SCALING_FACTOR = 100
  if (!answerInfo.answeredAt || !answerInfo.answeredAt) {
    return 0
  }
  const correctFactor = answerInfo.correct ? 1 : 0;
  const start = new Date(answerInfo.questionStartedAt)
  const end = new Date(answerInfo.answeredAt);
  // add 1 to avoid divide by zero
  const secondsSpent = (end - start + 1) / 1000
  const speedScore = SPEED_SCORE_SCALING_FACTOR / (secondsSpent)
  return correctFactor * question.points * speedScore;
}
