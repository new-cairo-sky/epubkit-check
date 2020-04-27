#!/usr/bin/env node
import fs from "fs";
const path = require("path");
const spawnAsync = require("@expo/spawn-async");
const epubcheck_path = path.resolve(__dirname, "lib/epubcheck");

function linesToMessages(dir_path, lines) {
  return lines
    .map((line) => {
      // Replace path in logs to make it cleaner
      // Split err messages for object
      const parts = line
        .replace(new RegExp(`${dir_path}.epub/`, "g"), "")
        .split(": ");
      const loc = parts[1];
      const loc_regex = /^(.*?)\(([^,]+),([^)]+)\)/;
      const loc_arr = loc_regex.exec(loc);

      return {
        type: parts[0],
        file: loc_arr ? loc_arr[1] : "",
        line: loc_arr ? loc_arr[2] : "",
        col: loc_arr ? loc_arr[3] : "",
        msg: parts[2],
      };
    })
    .filter((l) => !!l.file); // filter noise (errors always have a file property)
}

async function processExecData(dir_path, command, args) {
  const output = await spawnAsync(command, args)
    .then(({ stdout }) => {
      return stdout;
    })
    .catch(({ stderr }) => {
      return stderr;
    });

  const lines = output.toString().split("\n");

  return lines.length > 1
    ? {
        pass: false,
        messages: linesToMessages(dir_path, lines),
      }
    : {
        pass: true,
        messages: [],
      };
}

/**
 * Check an ePub using epubcheck java application 
 * see: https://github.com/w3c/epubcheck/wiki/Running
 * @param {string} dirPath - path to epub
 * @param {object} userOptions - options object in the shape of: 
  { profile: string,
    mode: string
    save: bool
    out: string - path to output file or '-' for console. leave undefined for none. 
    xmp: string  - path to output file or '-' for console. leave undefined for none. 
    json: string - path to output file or '-' for console. leave undefined for none. 
    quiet: bool,
    fatal: bool,
    error: bool,
    warn: bool,
    usage: bool ,
    listChecks: string - path to file,
    customMessages: string - path to file,
  }
 */
async function epubkitCheck(dirPath, userOptions) {
  const jarPath = userOptions?.jarPath
    ? userOptions.jarPath
    : `${epubcheck_path}/epubcheck.jar`;

  const defaultOptions = {
    profile: "default",
    mode: undefined,
    save: undefined,
    out: undefined,
    xmp: undefined,
    json: undefined,
    quiet: true,
    fatal: false,
    error: false,
    warn: false,
    usage: false,
    listChecks: false,
    customMessages: false,
  };

  const mergedOptions = Object.assign(defaultOptions, userOptions);

  const optionArgs = Object.entries(mergedOptions).flatMap(([key, value]) => {
    if (!value) {
      return [];
    } else if (value === true) {
      return [`--${key}`];
    } else {
      return [`--${key}`, `${value}`];
    }
  }, []);

  const args = ["-jar", jarPath, dirPath].concat(optionArgs);

  return processExecData(dirPath, "java", args);
}

module.exports = epubkitCheck;
