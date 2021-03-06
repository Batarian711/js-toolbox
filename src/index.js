#!/usr/bin/env node

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

import packageInfo from '../package'
import Yargs from 'yargs'
import {
  build,
  lint,
  location,
  nodemon,
  scaffold,
  serve,
  test,
} from './commands'
import {debugConfigs, debugToolbox} from './flags'
import {EPILOG, PROLOG} from './banner'

const PARSER = Yargs.scriptName('bb')
  .usage(PROLOG)
  .epilog(EPILOG)
  .strict()
  .help('help', 'Show usage instructions.')
  .version('version', 'Show toolbox version.', packageInfo.version)
  .command(build)
  .command(lint)
  .command(location)
  .command(nodemon)
  .command(scaffold)
  .command(serve)
  .command(test)
  .demandCommand(1, 'Error: Use one of the commands available.')
  .recommendCommands()

debugConfigs(PARSER)
debugToolbox(PARSER)

PARSER.parse()
