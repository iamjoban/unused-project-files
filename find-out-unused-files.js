const fs = require("fs");
const path = require("path");
const walkSync = require("walk-sync");

/* 
   Find out files which are being used to create bundles.
   dir: Location where we output webpack content
*/
const findUsedFileFromSourceMap = (dir) => {
  let sourcesData = [];
  const subStrToRemove = "webpack:///";
  fs.readdirSync(dir).forEach((file) => {
    if (file.indexOf(".map") === -1) {
      return;
    }
    const content = fs.readFileSync(path.join("dist", file), "utf-8");
    if (content) {
      const sources = JSON.parse(content).sources;
      const updatedSources = sources.map((source) => {
        if (source.indexOf("webpack:///webpack/bootstrap") > -1) {
          return;
        }
        const index =
          source.indexOf("?") > -1 ? source.indexOf("?") : source.length;

        return source.substring(
          source.indexOf(subStrToRemove) + subStrToRemove.length,
          index
        );
      });
      sourcesData = sourcesData.concat(updatedSources);
    }
  });

  // Remove unwanted results
  sourcesData = sourcesData.filter(Boolean);

  // Remove duplicated files
  const filesBeingUsed = [];
  for (let i = 0; i < sourcesData.length; i++) {
    const currentSource = sourcesData[i];
    if (filesBeingUsed.indexOf(currentSource) === -1) {
      filesBeingUsed.push(currentSource);
    }
  }

  return filesBeingUsed;
};

/* 
  Read list of files from project

  dir: Location of project root folder
  ignorePaths: Files which we want to ignore. e.g node_modules
*/
const getAllProjectFiles = (dir, ignorePaths = []) => {
  let fileList = [];
  fs.readdirSync(dir).forEach((file) => {
    if (ignorePaths.indexOf(file) > -1) {
      return;
    }
    const isDirectory = fs.statSync(path.join(dir, file)).isDirectory();
    if (isDirectory) {
      const pathList = walkSync(path.join(dir, file));
      //Creating absolute paths
      const absolutePathList = pathList.map((filePath) =>
        path.resolve(path.join(dir, file, filePath))
      );
      fileList = fileList.concat(absolutePathList);
    } else {
      fileList = fileList.concat(path.resolve(path.join(dir, file)));
    }
  });
  return fileList;
};

const getUnusedFileByType = (unusedFiles, type) =>
  unusedFiles.filter((file) => file.indexOf("." + type) > -1);

const filesBeingUsed = findUsedFileFromSourceMap("dist");
console.log(filesBeingUsed);

// Generate Absolute paths
const bundledFilePaths = filesBeingUsed.map((key) => {
  const absolutePath = path.resolve(key);
  return absolutePath;
});
console.log("bundledFilePaths", bundledFilePaths);

const ignorePaths = [
  "node_modules",
  "dist",
  "/.git",
  ".DS_Store",
  "package-lock.json",
  "package.json",
  "webpack.config.js",
  "README.md",
];

const projectFiles = getAllProjectFiles("./", ignorePaths);
console.log("projectFiles", projectFiles);

const unusedFiles = projectFiles.filter(
  (filePath) => bundledFilePaths.indexOf(filePath) === -1
);

//console.log("Unused files", unusedFiles);
console.log("Unused JS files", getUnusedFileByType(unusedFiles, "js"));
console.log("Unused CSS files", getUnusedFileByType(unusedFiles, "css"));
