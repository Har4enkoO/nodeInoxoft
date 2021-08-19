const fs = require("fs");
const path = require("path");
const util = require("util");

const readFilePromise = util.promisify(fs.readFile);
const renameFile = util.promisify(fs.rename);
const readDirPromise = util.promisify(fs.readdir);

const boysFolder = path.join(__dirname, "boys");
const girlsFolder = path.join(__dirname, "girls");

const changeFolderForGender = async (folderPath) => {
  try {
    const data = await readDirPromise(folderPath);
    data.forEach(async (file) => {
      const currentFilePath = path.join(folderPath, file);
      const human = JSON.parse(await readFilePromise(currentFilePath));
      newFilePath = path.join(human.gender === "female" ? girlsFolder : boysFolder, file);
      renameFile(currentFilePath, newFilePath);
    });
  } catch (error) {
    console.log("error", err);
  }
};
changeFolderForGender(boysFolder);
changeFolderForGender(girlsFolder);
