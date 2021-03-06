import * as path from "path";
import { shell } from "./utils";
import async = require("async");
const console = require('consola');

interface CliOption {
  projects: string[];
  branch: string;
}

/**
 * @param option
 */
export const run = (option: CliOption) => {
  const series = {};
  option.projects.forEach(k => {
    const gitPath = path.resolve(k);
    series[k] = done => {
      shell("cd " + gitPath + "&& git pull --rebase --autostash")
        .then(result => {
          // @ts-ignore
          if (result.stdout) {
            // @ts-ignore
            console.info(k, result.stdout);
          }
          // @ts-ignore
          if (result.stderr) {
            // @ts-ignore
            console.warn(k, result.stderr);
          }
          done(null, result);
        })
        .catch(err => {
          console.error(k, err);
          done(null,err);
        });
    };
  });
  async.series(series);
};
