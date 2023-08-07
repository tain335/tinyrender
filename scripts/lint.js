const path = require("path");
const fs = require('fs-extra');
const glob = require('glob');
const child_process = require("child_process");

const files = process.argv.slice(2);
const cwd = process.cwd();

const projects = glob.sync('**/.eslintrc.js', { ignore: "**/node_modules/**" }).map((file)=> {
  const p = path.join(cwd, file);
  return path.dirname(p);
})

const needLintProject = {};

files.forEach((file)=> {
  for(let i = 0; i < projects.length; i++) {
    if(file.startsWith(projects[i])) {
      needLintProject[projects[i]] = true;
    }
  }
})
console.log(files)
if(Object.keys(needLintProject).length) {
  Object.keys(needLintProject).forEach((p)=> {
    child_process.execSync('npx eslint --fix', {cwd: p})
  });
}