import chalk from 'chalk';
import ncp from 'ncp';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';

// Convert to fs.access to Async Function | Assign to access variable
const access = promisify(fs.access);

