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
const minimist = require('minimist');
const { resolve } = require('path');
const fs = require('fs-extra');
const plugins = require('./process.plugins');

const { plugin } = minimist(process.argv.slice(2));

const targetPlugins = plugin ? [plugin] : plugins;

targetPlugins.forEach((targetPlugin) => {
  const packageDir = resolve(__dirname, `../plugins/${targetPlugin}`);

  const cwdOptions = {
    cwd: packageDir,
    stdio: [0, 1, 2]
  };

  execSync(`rm -rf ${packageDir}/dist`);
  execSync(
    'npx babel . -d dist --extensions ".ts" --ignore "*.test.ts"',
    cwdOptions
  );
  const content = fs
    .readFileSync(`${packageDir}/dist/index.js`, 'utf-8')
    .replace(/export{};$/, '');
  fs.writeFileSync(`${packageDir}/dist/index.js`, content);
  execSync('npx @adobe/griffon-packager', cwdOptions);
});
