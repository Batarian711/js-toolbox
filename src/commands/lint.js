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

import {CONFIGS_DIR, PACKAGE_DIR} from '../paths'
import {EPILOG, PROLOG, SEPARATOR} from '../banner'
import {join} from 'path'
import {getModuleNameVersion} from '../modules'
import {assertBinaryExists, runBinPiped} from '../binaries'

const CONFIG_PATH = join(CONFIGS_DIR, 'eslint', 'index.js')
const BASIC_ARGS = [
  '--ignore-pattern', 'build/**',
  '--config', CONFIG_PATH,
  PACKAGE_DIR,
]

function builder(yargs) {
  yargs.option('fix', {
    description: 'Fix lint errors.',
  })
}

function lintSources(args) {
  let eslintArgs = [
    '--ignore-pattern', '**/__tests__/**',
    ...BASIC_ARGS,
  ]
  runEslint(eslintArgs, args)
}

function lintTests(args) {
  let eslintArgs = [
    '--ignore-pattern', 'src/**',
    '--ignore-pattern', '!**/__tests__',
    '--ignore-pattern', '!**/__tests__/**',
    ...BASIC_ARGS,
  ]
  runEslint(eslintArgs, args)
}

function handler(args) {
  assertBinaryExists('eslint')

  console.log(PROLOG)
  console.log('Linter: %s', getModuleNameVersion('eslint'))
  console.log(SEPARATOR)

  console.log()
  console.log('    [1/2] Linting sources...')
  lintSources(args)

  console.log()
  console.log('    [2/2] Linting tests...')
  lintTests(args)

  console.log()
  console.log(EPILOG)
}

function logBuffer(buffer:Buffer) {
  if (buffer.length)
    console.log(buffer.toString().replace(/\n+$/, ''))
}

function runEslint(args, env) {
  let {
    stdout: outSources,
    stderr: errorSources,
  } = runBinPiped('eslint', args, env)

  logBuffer(errorSources)
  logBuffer(outSources)
}

export default {
  command: 'lint',
  description: 'Check or fix code style.',
  builder,
  handler,
}
