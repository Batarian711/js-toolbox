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
import {build, lint, scaffold, test} from './commands'
import {EPILOG, PROLOG} from './banner'
import {PACKAGE_DIR} from './paths'

const PARSER = Yargs.scriptName("ctr")
  .usage(PROLOG)
  .epilog(EPILOG)
  .strict()
  .help('help', 'Show usage instructions.')
  .version('version', 'Show toolbox version.', packageInfo.version)

if (PACKAGE_DIR) {
  PARSER.command(build)
    .command(scaffold)
    .command(lint)
    .command(test)
} else
  PARSER.command(scaffold)

PARSER.demandCommand(1, 'Error: Use one of the commands available.')
  .recommendCommands()
  .parse()
