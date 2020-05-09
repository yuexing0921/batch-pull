import * as fs from "fs";
import * as process from "child_process";

export interface FileInfo {
  name: string;
  git: string;
  file: boolean;
  directory: boolean;
  blockDevice: boolean;
  characterDevice: boolean;
  symbolicLink: boolean;
  FIFO: boolean;
  socket: boolean;
}

export const getFileInfo = filename => {
  const stats = fs.statSync(filename);
  let directory = false,
    git = false;
  if (stats.isDirectory()) {
    directory = true;
    git = fs.existsSync(filename + ".git");
  }
  return {
    name: filename,
    file: stats.isFile(),
    git,
    directory,
    blockDevice: stats.isBlockDevice(),
    characterDevice: stats.isCharacterDevice(),
    symbolicLink: stats.isSymbolicLink(),
    FIFO: stats.isFIFO(),
    socket: stats.isSocket()
  };
};

export const getFilesInfo = (files: string[]) => {
  return files.map(k => getFileInfo(k));
};

export const shell = function(shell) {
  return new Promise((resolve, reject) => {
    process.exec(shell, (error, stdout, stderr) => {
      if (error !== null) {
        console.log("exec error: " + error);
        return reject(error);
      }
      return resolve({ stdout, stderr });
    });
  });
};
