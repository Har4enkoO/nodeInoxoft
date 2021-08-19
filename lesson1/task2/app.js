const fs = require("fs");
const path = require("path");
const util = require("util");

const renameFile = util.promisify(fs.rename);
const readDirPromise = util.promisify(fs.readdir);
const statPromisify = util.promisify(fs.stat);

const mainFolder = path.join(__dirname);

const changeFolder = async (folder) => {
  try {
    const data = await readDirPromise(folder);
    data.forEach((file) => {
      const currentFilePath = path.join(folder, file);
      statPromisify(currentFilePath, (err, stats) => {
        if (err) {
          console.log(err);
          return;
        }
        stats.isFile()
          ? renameFile(currentFilePath, path.join(mainFolder, file))
          : changeFolder(currentFilePath);
      });
    });
  } catch (error) {
    console.log("error ", error);
  }
};

changeFolder(mainFolder);
