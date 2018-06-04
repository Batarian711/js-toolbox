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

import {CONFIGS_DIR} from '../paths'
import {join} from 'path'
import {runBinary} from '../binaries'

const PRESET_LOCATION = join(CONFIGS_DIR, 'babel-preset', 'index.js')
const BABEL_ARGS = [
  'src',
  '-d',
  'build',
  '--ignore',
  '**/__*__/**',
  '--source-maps inline',
  `--presets=${PRESET_LOCATION}`,
]

export default {
  command: 'build',
  description: 'Build the project.',
  handler: ctrineArgs => {
    runBinary('rimraf', ['"build"'])
    // Ctrine arguments are passed as environment variables.
    runBinary('babel', BABEL_ARGS, ctrineArgs)
  },
}
