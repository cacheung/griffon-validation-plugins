/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/* eslint no-console: 0 */
/* eslint-disable @typescript-eslint/no-var-requires */

const { execSync } = require('child_process');
const { readdirSync } = require('fs');
const minimist = require('minimist');
const { resolve } = require('path');
const plugins = require('./process.plugins');

const { plugin } = minimist(process.argv.slice(2));

const targetPlugins = plugin ? [plugin] : plugins;

const ZIP_NAME_REGEX = /\.zip$/;

targetPlugins.forEach((targetPlugin) => {
  const packageDir = resolve(__dirname, `../plugins/${targetPlugin}`);

  const packageZips = readdirSync(packageDir).filter((file) =>
    ZIP_NAME_REGEX.test(file)
  );

  const cwdOptions = {
    cwd: packageDir,
    stdio: [0, 1, 2]
  };

  if (packageZips.length === 1) {
    execSync(
      `npx --package=@adobe/griffon-plugin-tools griffon-uploader ${packageZips[0]}`,
      cwdOptions
    );
  } else {
    const message =
      packageZips.length === 0
        ? `No package zip found for plugin ${targetPlugin}`
        : `Could not determine which package zip to upload for plugin ${targetPlugin}`;
    console.log(message);
  }
});
