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
  flow,
  jsx,
  node,
  platforms,
  react,
  typeScript,
} from '../flags'
import {CONFIGS_DIR, PACKAGE_DIR} from '../paths'
import {join} from 'path'
import {exitOnError, runBinSync} from '../binaries'
import {exitOnPackageNotFound} from '../util'

const CONFIG_PATH = join(CONFIGS_DIR, 'eslint', 'index.js')
const BASIC_ARGS = [
  `--config "${CONFIG_PATH}"`,
  `"${join(PACKAGE_DIR, 'src')}"`,
]

function builder(yargs) {
  browsers(yargs)
  flow(yargs)
  jsx(yargs)
  node(yargs)
  platforms(yargs)
  react(yargs)
  typeScript(yargs)

  yargs.option('fix', {
    description: 'Fix lint errors.',
  })
}

function lintSources(args) {
  let eslintArgs = [
    '--ignore-pattern "src/**/__tests__"',
    '--ignore-pattern "src/**/__tests__/**"',
    ...BASIC_ARGS,
  ]

  let {fix} = args
  if (fix)
    eslintArgs.push('--fix')

  const ENV = args
  return runBinSync('eslint', eslintArgs, ENV)
}

function lintTests(args) {
  let eslintArgs = [
    '--ignore-pattern "src/**"',
    '--ignore-pattern "!**/__tests__"',
    '--ignore-pattern "!**/__tests__/**"',
    ...BASIC_ARGS,
  ]

  let {fix} = args
  if (fix)
    eslintArgs.push('--fix')

  const ENV = {jest: true, ...args}
  return runBinSync('eslint', eslintArgs, ENV)
}

function handler(args) {
  exitOnPackageNotFound()

  console.log()
  console.log('[0/2] Linting sources...')
  let resultSources = lintSources(args)
  console.log('[1/2] Linting tests...')
  let resultTests = lintTests(args)
  console.log('[2/2] Done linting.')

  exitOnError(resultSources)
  exitOnError(resultTests)
}

export default {
  command: 'lint',
  description: 'Check or fix code style.',
  builder,
  handler,
}
