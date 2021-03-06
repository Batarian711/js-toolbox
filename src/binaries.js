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

import prettyFormat from 'pretty-format'
import {delimiter as PATH_DELIMITER} from 'path'
import {BIN_DIR, PACKAGE_DIR} from './paths'
import {pickNonFalsy} from './util'
import {spawn, spawnSync} from 'child_process'

const PATH_KEY = process.platform === 'win32' ? 'Path' : 'PATH'
const TOOLBOX_PATH = BIN_DIR + PATH_DELIMITER + process.env[PATH_KEY]
const SUCCESS = 0

export function exitOnError(runBinResult) {
  if (runBinResult.status !== SUCCESS)
    process.exit(runBinResult.status)
}

export function runBin(bin:string, args:string[], env?:Object) {
  return internalRunBin(spawn, bin, args, env)
}

export function runBinSync(bin:string, args:string[], env?:Object) {
  return internalRunBin(spawnSync, bin, args, env)
}

function internalRunBin(
  spawn:Function,
  bin:string,
  args:string[],
  env?:Object,
) {
  const COMPUTED_ENV = {
    ...process.env,
    [PATH_KEY]: TOOLBOX_PATH,
    borela: JSON.stringify(pickNonFalsy(env)),
  }

  let {debugToolbox} = env || {}
  if (debugToolbox) {
    console.log('Spawning binary: ', prettyFormat({
      Arguments: args,
      Binary: bin,
      Environment: env,
    }))
  }

  let result = spawn(bin, args, {
    cwd: PACKAGE_DIR,
    env: COMPUTED_ENV,
    shell: true,
    stdio: 'inherit',
  })

  if (debugToolbox)
    console.log('Spawn result: ', prettyFormat(result))

  return result
}
