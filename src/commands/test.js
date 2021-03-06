// Licensed under the Apache License, Version 2.0 (the “License”); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an “AS IS” BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations under
// the License.

import {
  browsers,
  disableExperimentalPlugins,
  flow,
  jsx,
  node,
  platforms,
  react,
  typeScript,
} from '../flags'
import {CONFIGS_DIR} from '../paths'
import {join} from 'path'
import {exitOnError, runBinSync} from '../binaries'
import {exitOnPackageNotFound} from '../util'

const CONFIG_PATH = join(CONFIGS_DIR, 'jest', 'index.js')

function builder(yargs) {
  browsers(yargs)
  disableExperimentalPlugins(yargs)
  flow(yargs)
  jsx(yargs)
  node(yargs)
  platforms(yargs)
  react(yargs)
  typeScript(yargs)

  yargs.options({
    watch: {
      default: false,
      description: 'Watch for changes and run tests automatically.',
      type: 'boolean',
    },
  })
}

function handler(args) {
  exitOnPackageNotFound()

  let jestArgs = [`--config="${CONFIG_PATH}"`]
  if (args.watch)
    jestArgs.push('--watch')

  const ENV = args
  exitOnError(runBinSync('jest', jestArgs, ENV))
}

export default {
  command: 'test',
  description: 'Run test suites.',
  builder,
  handler,
}
