const path = require('path');

const { IGNORE_FILE_LiST_DEFAULT, IGNORE_TYPE_SET_DEFAULT } = require('./constant');

/**
 * @param {Array<string>} outerIgnoreList
 * @returns {Set<string>}
 */
const createIgnoreFoldersSet = (outerIgnoreFolders) => new Set(IGNORE_FILE_LiST_DEFAULT.concat(outerIgnoreFolders));

/**
 * @param {string} fileName
 * @returns {boolean}
 */
const isHiddenFile = (fileName = '') => fileName.indexOf('.') === 0;

/**
 * @param {string} fileName
 * @returns {boolean}
 */
const isDefaultIgnoreType = (fileName) => {
  const fileType = path.extname(fileName).toLowerCase();
  return IGNORE_TYPE_SET_DEFAULT.has(fileType);
};

/**
 * @param {string} fileName
 * @returns {boolean}
 */
const isDeclareFile = (fileName) => {
  const firstDotIndex = fileName.indexOf('.');
  return fileName.slice(firstDotIndex) === '.d.ts';
};

/**
 * @param {string} fileName
 * @returns {boolean}
 */
const isFileValid = (fileName) => !isDefaultIgnoreType(fileName) && !isHiddenFile(fileName) && !isDeclareFile(fileName);

/**
 * @param {string} fileName
 * @returns {string}
 */
const getRealFileName = (fileName) => {
  const lastDotIndex = fileName.lastIndexOf('.');
  return fileName.slice(0, lastDotIndex);
};

/**
 * @param {Object} options - The options object.
 * @param {string} options.oriPath - The original absolute path.
 * @param {string} options.targetPath - The target absolute path.
 * @param {Array<string>} options.ignoreFolders - An array of folders to ignore.
 */
const isParamValid = (params) => {
  const { oriPath, targetPath, ignoreFolders = [] } = params;
  const isOriPathValid = oriPath.startsWith('/');
  const isTargetPathValid = targetPath.startsWith('/');
  const isIgnoreFoldersValid = ignoreFolders.every(item => typeof item === 'string');

  return isOriPathValid && isTargetPathValid && isIgnoreFoldersValid;
}

module.exports = {
  createIgnoreFoldersSet,
  isFileValid,
  getRealFileName,
  isParamValid,
};
