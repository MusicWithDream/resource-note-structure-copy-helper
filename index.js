const fs = require('fs');
const path = require('path');

const { isFileValid, createIgnoreFoldersSet, getRealFileName, isParamValid } = require('./util');

/**
 * @param {Object} options - The options object.
 * @param {string} options.oriPath - The original absolute path.
 * @param {string} options.targetPath - The target absolute path.
 * @param {Array<string>} options.ignoreFolders - An array of folders to ignore.
 */
class StructureCopyHelper {
  /**
   * @member {Set<string>} ignoreFoldersSet - A set of folders to ignore
   */
  ignoreFoldersSet;

  constructor(params) {
    if (!isParamValid(params)) throw Error('参数不合法，请检查');
    const { oriPath, targetPath, ignoreFolders = [] } = params;
    this.oriPath = oriPath;
    this.targetPath = targetPath;
    this.ignoreFoldersSet = createIgnoreFoldersSet(ignoreFolders);
  }

  /**
   * Represents a folder structure object that may contain files and folders.
   * @typedef {Object} FolderItem
   * @property {string} name - The name of the file or folder.
   * @property {FolderItem} children - An array of child items (files and folders).
   */
  /**
   * @param {string} oriPath - The original absolute path.
   * @returns {FolderItem}
   */
  getOriFolderStructure(oriPath = '') {
    const files = fs.readdirSync(oriPath, { withFileTypes: true });
    const fileStructure = {};
    files.forEach((file) => {
      const { name } = file;
      if (this.ignoreFoldersSet.has(name) || !isFileValid(name)) return;
      const filePath = path.join(oriPath, name);
      if (file.isDirectory()) {
        fileStructure[name] = this.getOriFolderStructure(filePath);
      } else {
        fileStructure[getRealFileName(name)] = null;
      }
    });

    return fileStructure;
  }

  /**
   * @param {string} targetPath - The target absolute path.
   * @param {FolderItem} folderStructure - The original absolute path.
   * @returns {void}
   */
  setMDDoc2TargetFolder(targetPath, folderStructure) {
    const DEFAULT_FILE_TYPE = '.md';
    for (const fileName in folderStructure) {
      const fileObj = folderStructure[fileName];
      if (fileObj) {
        const curPath = `${targetPath}/${fileName}`;
        fs.mkdir(curPath, (error) => {
          if (error) {
            console.error(`create folder error:${JSON.stringify(error)}`);
            return;
          }
          this.setMDDoc2TargetFolder(curPath, fileObj);
        });
      } else {
        fs.writeFile(`${targetPath}/${fileName}${DEFAULT_FILE_TYPE}`, '', (error) => {
          if (error) {
            console.error(`write file error:${JSON.stringify(error)}`);
            return;
          }
        });
      }
    }
  }

  launch() {
    const folderStructure = this.getOriFolderStructure(this.oriPath);
    this.setMDDoc2TargetFolder(this.targetPath, folderStructure);
  }
}

module.exports = StructureCopyHelper;
